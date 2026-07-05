import { useCallback, useEffect, useRef, useState } from 'react'
import { loadVoiceURI, saveVoiceURI } from '../engine/storage'

// Flip to true to log voice selection and per-utterance diagnostics.
const DEBUG = false
const log = (...args: unknown[]) => {
  if (DEBUG) console.log('[speech]', ...args)
}

const FRENCH = 'fr-FR'
const isFrench = (v: SpeechSynthesisVoice) => v.lang.toLowerCase().startsWith('fr')
const describe = (v?: SpeechSynthesisVoice | null) =>
  v ? `${v.name} (${v.lang})${v.localService ? '' : ' [remote]'}` : 'browser default'

// Chrome's network ("remote") voices — e.g. "Google français" — routinely
// accept an utterance, report speaking=true, then never fire start/end/error
// and produce no audio. If a voice hasn't started speaking within this window
// we treat it as dead and fall back to the next candidate.
const START_TIMEOUT_MS = 1200
// Cap fallback attempts so a fully broken engine can't loop forever.
const MAX_ATTEMPTS = 5

/**
 * Priority-ordered list of voices to try. Local (on-device) French voices win
 * because they're reliable and work offline; remote voices sink to the bottom.
 * A saved voice is honored first only if it's local, so a previously-persisted
 * broken Google voice can't lock the app into silence.
 */
function rankVoices(available: SpeechSynthesisVoice[], savedURI: string | null): SpeechSynthesisVoice[] {
  const saved = savedURI ? available.find((v) => v.voiceURI === savedURI) : undefined
  const localFrench = available.filter((v) => isFrench(v) && v.localService)
  const localOther = available.filter((v) => !isFrench(v) && v.localService)
  const remoteFrench = available.filter((v) => isFrench(v) && !v.localService)

  const ordered: SpeechSynthesisVoice[] = []
  const add = (v?: SpeechSynthesisVoice) => {
    if (v && !ordered.includes(v)) ordered.push(v)
  }

  if (saved?.localService) add(saved) // a saved local voice is the user's explicit choice
  localFrench.forEach(add)
  localOther.forEach(add) // a local non-French voice still makes sound
  add(saved) // saved remote voice, if that's genuinely all we have
  remoteFrench.forEach(add)
  available.forEach(add) // absolute last resort
  return ordered
}

export function useSpeech() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoiceState] = useState<SpeechSynthesisVoice | null>(null)
  // Browsers block speechSynthesis until the user interacts with the page
  // (erroring "not-allowed"). Callers can hold off auto-speaking until then.
  const [unlocked, setUnlocked] = useState(false)

  // Ranked fallback list, kept in a ref so speak() always sees the latest.
  const rankedRef = useRef<SpeechSynthesisVoice[]>([])
  // Keep the current utterance referenced so Chrome doesn't GC it mid-speech.
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const watchdogRef = useRef<number | null>(null)
  // Drops near-instant duplicate requests (React StrictMode double-invokes
  // effects in dev; rapid re-renders can too).
  const lastSpeakRef = useRef<{ text: string; at: number } | null>(null)

  const clearWatchdog = () => {
    if (watchdogRef.current !== null) {
      clearTimeout(watchdogRef.current)
      watchdogRef.current = null
    }
  }

  // Discover voices (they load asynchronously in Chrome) and pick a default.
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      log('speechSynthesis NOT supported in this browser')
      return
    }
    const synth = window.speechSynthesis

    const loadVoices = () => {
      const available = synth.getVoices()
      if (available.length === 0) {
        log('0 voices yet — waiting for voiceschanged')
        return
      }
      const ranked = rankVoices(available, loadVoiceURI())
      rankedRef.current = ranked
      setVoices(available)
      log(
        `${available.length} voices. fallback order:`,
        ranked.slice(0, 4).map(describe),
      )
      setSelectedVoiceState((current) => {
        const next = current ?? ranked[0] ?? null
        log('default voice:', describe(next))
        return next
      })
    }

    loadVoices()
    synth.addEventListener('voiceschanged', loadVoices)
    return () => synth.removeEventListener('voiceschanged', loadVoices)
  }, [])

  // Flip `unlocked` on the first user gesture anywhere on the page.
  useEffect(() => {
    if (unlocked) return
    const unlock = () => setUnlocked(true)
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [unlocked])

  const setSelectedVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoiceState(voice)
    saveVoiceURI(voice.voiceURI)
    // Move the explicit choice to the front of the fallback list.
    rankedRef.current = [voice, ...rankedRef.current.filter((v) => v.voiceURI !== voice.voiceURI)]
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
      const synth = window.speechSynthesis
      const trimmed = text.trim()
      if (!trimmed) return

      // De-dupe rapid duplicate requests for the same text.
      const now = Date.now()
      const last = lastSpeakRef.current
      if (last && last.text === trimmed && now - last.at < 400) {
        log('skip duplicate:', JSON.stringify(trimmed))
        return
      }
      lastSpeakRef.current = { text: trimmed, at: now }

      // Candidate list: the selected voice first, then every ranked fallback.
      const candidates = selectedVoice
        ? [selectedVoice, ...rankedRef.current.filter((v) => v.voiceURI !== selectedVoice.voiceURI)]
        : rankedRef.current.slice()

      log('speak:', JSON.stringify(trimmed), '| candidates:', candidates.slice(0, 4).map((v) => v.name))

      clearWatchdog()
      if (synth.speaking || synth.pending) synth.cancel()

      const tryVoice = (index: number) => {
        const voice = candidates[index]
        const utterance = new SpeechSynthesisUtterance(trimmed)
        if (voice) {
          utterance.voice = voice
          utterance.lang = voice.lang
        } else {
          utterance.lang = FRENCH
        }

        let started = false
        utterance.onstart = () => {
          started = true
          clearWatchdog()
          log('▶ START:', describe(voice))
        }
        utterance.onend = () => {
          clearWatchdog()
          log('■ END:', describe(voice))
        }
        utterance.onerror = (event) => {
          clearWatchdog()
          // A cancel/interrupt is our own doing (fallback or a new card); ignore.
          if (event.error === 'canceled' || event.error === 'interrupted') return
          log('✗ ERROR:', event.error, '| voice:', describe(voice), '→ trying next')
          advance(index)
        }

        utteranceRef.current = utterance
        log(`attempt ${index}: ${describe(voice)}`)
        synth.speak(utterance)
        // Chrome sometimes leaves the queue paused after a cancel(); nudge it.
        if (synth.paused) synth.resume()

        // Watchdog: if nothing starts, assume this voice is dead and move on.
        watchdogRef.current = window.setTimeout(() => {
          if (started) return
          log(`⏱ no audio from ${describe(voice)} within ${START_TIMEOUT_MS}ms → trying next`)
          try {
            synth.cancel()
          } catch {
            /* ignore */
          }
          advance(index)
        }, START_TIMEOUT_MS)
      }

      const advance = (index: number) => {
        const next = index + 1
        if (next >= candidates.length || next >= MAX_ATTEMPTS) {
          log('gave up: no working voice found after', next, 'attempts')
          return
        }
        tryVoice(next)
      }

      tryVoice(0)
    },
    [selectedVoice],
  )

  // Stop watchdog timers when the hook unmounts.
  useEffect(() => clearWatchdog, [])

  return { voices, selectedVoice, setSelectedVoice, speak, unlocked }
}
