import { useCallback, useEffect, useRef, useState } from 'react'
import { loadSpeechRate, loadVoiceURI, saveSpeechRate, saveVoiceURI } from '../engine/storage'

// Voice selection and per-utterance diagnostics. Debugging speech means
// watching events that happen with no visible output, so the log is kept in a
// buffer the UI can show — reaching for DevTools shouldn't be the only way to
// find out why a page is silent. Enabled from the settings panel (persisted) or
// with ?debug=speech in the URL; when on, lines also go to the console.
const DEBUG_KEY = 'speech-debug-v1'
const MAX_LOG_LINES = 200

let debugEnabled = false
const logLines: string[] = []
let onLogged: (() => void) | null = null

export function isSpeechDebugEnabled(): boolean {
  return debugEnabled
}

export function setSpeechDebugEnabled(on: boolean): void {
  debugEnabled = on
  try {
    localStorage.setItem(DEBUG_KEY, String(on))
  } catch {
    /* private mode */
  }
  onLogged?.()
}

export function getSpeechLog(): string[] {
  return logLines
}

export function clearSpeechLog(): void {
  logLines.length = 0
  onLogged?.()
}

// Read the persisted/URL setting once at module load, before anything speaks.
try {
  const fromUrl = new URLSearchParams(window.location.search).get('debug') === 'speech'
  debugEnabled = fromUrl || localStorage.getItem(DEBUG_KEY) === 'true'
} catch {
  /* no window/localStorage */
}

const format = (value: unknown) =>
  typeof value === 'string' ? value : Array.isArray(value) ? value.join(', ') : String(value)

const log = (...args: unknown[]) => {
  // Buffer unconditionally: whatever went wrong has usually already happened by
  // the time anyone thinks to turn logging on.
  const stamp = new Date().toISOString().slice(11, 23)
  logLines.push(`${stamp}  ${args.map(format).join(' ')}`)
  if (logLines.length > MAX_LOG_LINES) logLines.shift()
  if (debugEnabled) console.log('[speech]', ...args)
  onLogged?.()
}

const FRENCH = 'fr-FR'
export const isFrenchVoice = (v: SpeechSynthesisVoice) => v.lang.toLowerCase().startsWith('fr')
const isFrench = isFrenchVoice
const describe = (v?: SpeechSynthesisVoice | null) =>
  v ? `${v.name} (${v.lang})${v.localService ? '' : ' [remote]'}` : 'browser default'

// Chrome's network ("remote") voices — e.g. "Google français" — can accept an
// utterance, report speaking=true, then never fire start/end/error and produce
// no audio. If a voice hasn't started within its window we treat it as dead and
// fall back to the next candidate.
//
// The windows differ by voice type, and getting this wrong is what silenced
// Chrome: a remote voice has to fetch its audio over the network before it can
// start, which regularly takes longer than a second. A flat 1.2s budget killed
// every Google voice just before it spoke, and since Chrome on macOS often has
// *only* remote French voices, every candidate died in turn and the app went
// completely silent. A local voice starts near-instantly or not at all, so it
// keeps a short window.
// macOS "Premium"/"Enhanced" voices are local but load a large model from disk
// on first use, which takes well over a second — 1500ms cancelled Amélie and
// Audrey just before they spoke. Local voices are cheap to wait on, so be
// generous; the watchdog exists for voices that never speak at all.
const START_TIMEOUT_LOCAL_MS = 4000
const START_TIMEOUT_REMOTE_MS = 6000
// Chrome wedges its queue if speak() follows cancel() in the same tick — the
// new utterance is accepted and never spoken. Always let cancel settle first.
const CANCEL_SETTLE_MS = 120
// Cap fallback attempts so a fully broken engine can't loop forever.
const MAX_ATTEMPTS = 5

/**
 * Priority-ordered list of voices to try. Every French voice is tried before any
 * non-French one — an English voice reading French is worse than useless for
 * training an ear, so it exists purely as a last resort against total silence.
 * Within French, local (on-device) voices come first: they're reliable and work
 * offline, whereas Chrome's remote voices can accept an utterance and never
 * speak (hence the watchdog below).
 */
function rankVoices(available: SpeechSynthesisVoice[], savedURI: string | null): SpeechSynthesisVoice[] {
  const saved = savedURI ? available.find((v) => v.voiceURI === savedURI) : undefined
  const localFrench = available.filter((v) => isFrench(v) && v.localService)
  const remoteFrench = available.filter((v) => isFrench(v) && !v.localService)

  const ordered: SpeechSynthesisVoice[] = []
  const add = (v?: SpeechSynthesisVoice) => {
    if (v && !ordered.includes(v)) ordered.push(v)
  }

  if (saved?.localService) add(saved) // a saved local voice is the user's explicit choice
  localFrench.forEach(add)
  add(saved) // a saved remote French voice, ahead of the other remotes
  remoteFrench.forEach(add)
  available.forEach(add) // absolute last resort: any voice at all beats silence
  return ordered
}

/**
 * Outcome of the most recent utterance. `waiting` means the request is parked
 * until voices load; `no-audio` means a voice accepted the utterance and never
 * started (Chrome's remote voices do this), which is the failure that otherwise
 * looks exactly like the app being broken.
 */
export interface SpeechStatus {
  state:
    | 'idle'
    | 'waiting'
    | 'blocked'
    | 'speaking'
    | 'done'
    | 'error'
    | 'no-audio'
    | 'unsupported'
  voice?: string
  detail?: string
}

export function useSpeech() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoiceState] = useState<SpeechSynthesisVoice | null>(null)
  const [rate, setRateState] = useState(() => loadSpeechRate())

  // Keep the latest rate in a ref so speak() (memoized on selectedVoice) always
  // reads the current value without needing to re-create the callback.
  const rateRef = useRef(rate)
  rateRef.current = rate

  // Ranked fallback list, kept in a ref so speak() always sees the latest.
  const rankedRef = useRef<SpeechSynthesisVoice[]>([])
  // Keep the current utterance referenced so Chrome doesn't GC it mid-speech.
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const watchdogRef = useRef<number | null>(null)
  // The retry/settle delay gets its own slot. Sharing one ref with the watchdog
  // meant whichever was written last orphaned the other, leaving a timer alive
  // that later cancelled a perfectly healthy utterance.
  const retryRef = useRef<number | null>(null)
  // Drops near-instant duplicate requests (React StrictMode double-invokes
  // effects in dev; rapid re-renders can too).
  const lastSpeakRef = useRef<{ text: string; at: number } | null>(null)
  // Voices load asynchronously, so the first card can ask to speak before any
  // exist. Speaking then would go out with no voice set and get the browser
  // default — an English voice reading French. Hold the text here instead and
  // say it the moment the real voices arrive.
  const pendingRef = useRef<string | null>(null)
  // What the last utterance actually did, surfaced in the UI: silent failures
  // here are otherwise invisible, and the cause differs for each kind.
  const [status, setStatus] = useState<SpeechStatus>({ state: 'idle' })
  // Bumped on every logged line so a visible log re-renders.
  const [, setLogVersion] = useState(0)

  const clearWatchdog = () => {
    if (watchdogRef.current !== null) {
      clearTimeout(watchdogRef.current)
      watchdogRef.current = null
    }
  }

  const clearRetry = () => {
    if (retryRef.current !== null) {
      clearTimeout(retryRef.current)
      retryRef.current = null
    }
  }

  const clearTimers = () => {
    clearWatchdog()
    clearRetry()
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
      const savedURI = loadVoiceURI()
      const ranked = rankVoices(available, savedURI)
      rankedRef.current = ranked
      setVoices(available)
      log(
        `${available.length} voices. fallback order:`,
        ranked.slice(0, 4).map(describe),
      )
      setSelectedVoiceState((current) => {
        // Honor the user's saved choice as the default even if it's a remote
        // voice (rankVoices deprioritizes those for *fallback*, but the saved
        // voice is still the explicit selection). Fall back to the top rank.
        const saved = savedURI ? available.find((v) => v.voiceURI === savedURI) : undefined
        const next = current ?? saved ?? ranked[0] ?? null
        log('default voice:', describe(next))
        return next
      })
    }

    loadVoices()
    synth.addEventListener('voiceschanged', loadVoices)
    return () => synth.removeEventListener('voiceschanged', loadVoices)
  }, [])

  // Prime the engine on the first gesture, from inside the handler itself.
  // Chrome is markedly happier about later, asynchronous speak() calls once it
  // has seen one during a real user activation, and a silent utterance costs
  // nothing. This is an optimisation, not a gate — callers speak whenever they
  // like and blocked text is parked and retried (see the flush effect below).
  useEffect(() => {
    const prime = () => {
      try {
        const primer = new SpeechSynthesisUtterance(' ')
        primer.volume = 0
        window.speechSynthesis.speak(primer)
        log('🔓 first gesture — primed engine inside the handler')
      } catch (error) {
        log('🔓 first gesture — priming failed:', String(error))
      }
    }
    window.addEventListener('pointerdown', prime, { once: true })
    window.addEventListener('keydown', prime, { once: true })
    return () => {
      window.removeEventListener('pointerdown', prime)
      window.removeEventListener('keydown', prime)
    }
  }, [])

  const setSelectedVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoiceState(voice)
    saveVoiceURI(voice.voiceURI)
    // Move the explicit choice to the front of the fallback list.
    rankedRef.current = [voice, ...rankedRef.current.filter((v) => v.voiceURI !== voice.voiceURI)]
  }, [])

  const setRate = useCallback((next: number) => {
    setRateState(next)
    saveSpeechRate(next)
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setStatus({ state: 'unsupported' })
        return
      }
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

      // Nothing to speak with yet. Speaking anyway would hand the utterance to
      // the browser's default voice — English, on most machines. Park it.
      if (candidates.length === 0) {
        log('no voices loaded yet — parking:', JSON.stringify(trimmed))
        pendingRef.current = trimmed
        lastSpeakRef.current = null // let the flush through the de-dupe window
        setStatus({ state: 'waiting', detail: 'waiting for voices to load' })
        return
      }

      log('speak:', JSON.stringify(trimmed), '| candidates:', candidates.slice(0, 4).map((v) => v.name))

      clearTimers()
      const cancelled = synth.speaking || synth.pending
      if (cancelled) {
        log(`↺ cancelling in-flight speech, settling ${CANCEL_SETTLE_MS}ms first`)
        synth.cancel()
      }

      const tryVoice = (index: number) => {
        const voice = candidates[index]
        const utterance = new SpeechSynthesisUtterance(trimmed)
        utterance.rate = rateRef.current
        if (voice) {
          utterance.voice = voice
          utterance.lang = voice.lang
        } else {
          utterance.lang = FRENCH
        }

        // Chrome can fire onerror *synchronously* from inside speak(), before
        // the watchdog below is installed. `settled` records that, so we never
        // arm a timer for an utterance that is already finished — an orphaned
        // one fires much later and cancels whatever is speaking by then.
        let settled = false
        utterance.onstart = () => {
          settled = true
          clearWatchdog()
          log('▶ START:', describe(voice))
          setStatus({ state: 'speaking', voice: describe(voice) })
        }
        utterance.onend = () => {
          settled = true
          clearWatchdog()
          log('■ END:', describe(voice))
          setStatus({ state: 'done', voice: describe(voice) })
        }
        utterance.onerror = (event) => {
          settled = true
          clearWatchdog()
          // A cancel/interrupt is our own doing (fallback or a new card); ignore.
          if (event.error === 'canceled' || event.error === 'interrupted') return

          // "not-allowed" is the autoplay gate, not a broken voice: the page
          // hasn't earned a user activation yet. Trying the next voice would
          // burn the whole candidate list on a condition none of them can fix,
          // so park the text and let the next real click deliver it.
          if (event.error === 'not-allowed') {
            log('🔒 not-allowed — parking until the next user gesture')
            pendingRef.current = trimmed
            lastSpeakRef.current = null
            setStatus({ state: 'blocked', detail: 'waiting for a click to allow audio' })
            return
          }

          log('✗ ERROR:', event.error, '| voice:', describe(voice), '→ trying next')
          setStatus({ state: 'error', voice: describe(voice), detail: event.error })
          advance(index)
        }

        utteranceRef.current = utterance
        log(`attempt ${index}: ${describe(voice)} @ rate ${utterance.rate}`)
        synth.speak(utterance)
        log(`   queued — speaking=${synth.speaking} pending=${synth.pending} paused=${synth.paused}`)
        // Chrome sometimes leaves the queue paused after a cancel(); nudge it.
        if (synth.paused) synth.resume()

        // Already over (a synchronous error) — arming a watchdog now would leave
        // a timer running against an utterance nobody is waiting for.
        if (settled) return

        // Watchdog: if nothing starts, assume this voice is dead and move on.
        // Remote voices get a much longer leash — see the constants above.
        const budget = voice?.localService === false ? START_TIMEOUT_REMOTE_MS : START_TIMEOUT_LOCAL_MS
        watchdogRef.current = window.setTimeout(() => {
          watchdogRef.current = null
          if (settled) return
          log(`⏱ no audio from ${describe(voice)} within ${budget}ms → trying next`)
          setStatus({
            state: 'no-audio',
            voice: describe(voice),
            detail: `accepted the text but never spoke (${budget}ms)`,
          })
          try {
            synth.cancel()
          } catch {
            /* ignore */
          }
          advance(index)
        }, budget)
      }

      const advance = (index: number) => {
        const next = index + 1
        if (next >= candidates.length || next >= MAX_ATTEMPTS) {
          log('gave up: no working voice found after', next, 'attempts')
          setStatus({ state: 'error', detail: `no working voice after ${next} attempts` })
          return
        }
        // We just cancelled the dead utterance; give Chrome a tick to settle
        // before handing it another, or it accepts and never speaks.
        clearRetry()
        retryRef.current = window.setTimeout(() => {
          retryRef.current = null
          tryVoice(next)
        }, CANCEL_SETTLE_MS)
      }

      if (cancelled) {
        retryRef.current = window.setTimeout(() => {
          retryRef.current = null
          tryVoice(0)
        }, CANCEL_SETTLE_MS)
      } else {
        tryVoice(0)
      }
    },
    [selectedVoice],
  )

  // Say whatever was parked while the voice list was still empty. Runs when
  // voices land and when a voice is chosen, so the first card of a session gets
  // a real French voice instead of the browser default.
  useEffect(() => {
    const pending = pendingRef.current
    if (!pending || rankedRef.current.length === 0) return
    pendingRef.current = null
    speak(pending)
  }, [voices, selectedVoice, speak])

  // Every click is another chance to deliver text that Chrome refused for want
  // of a user activation. This listener stays for the session (unlike the
  // one-shot unlock above) because the gate can bite more than once.
  useEffect(() => {
    const flush = () => {
      const pending = pendingRef.current
      if (!pending) return
      log('👆 gesture — retrying parked utterance')
      pendingRef.current = null
      speak(pending)
    }
    window.addEventListener('pointerup', flush)
    window.addEventListener('keyup', flush)
    return () => {
      window.removeEventListener('pointerup', flush)
      window.removeEventListener('keyup', flush)
    }
  }, [speak])

  // Re-render whenever a line is logged, so a visible log stays live.
  useEffect(() => {
    onLogged = () => setLogVersion((v) => v + 1)
    return () => {
      onLogged = null
    }
  }, [])

  // Stop pending timers when the hook unmounts.
  useEffect(() => clearTimers, [])

  return { voices, selectedVoice, setSelectedVoice, rate, setRate, speak, status }
}
