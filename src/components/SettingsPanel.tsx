import { useState } from 'react'
import {
  clearSpeechLog,
  getSpeechLog,
  isFrenchVoice,
  isSpeechDebugEnabled,
  setSpeechDebugEnabled,
  type SpeechStatus,
} from '../hooks/useSpeech'
import { MAX_SPEECH_RATE, MIN_SPEECH_RATE } from '../engine/storage'

interface SettingsPanelProps {
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  onSelectVoice: (voice: SpeechSynthesisVoice) => void
  rate: number
  onSetRate: (rate: number) => void
  onSpeak: (text: string) => void
  status: SpeechStatus
  /** Whether the pronunciation line shows under an answered sentence. */
  showPhonetic: boolean
  onSetShowPhonetic: (show: boolean) => void
}

/** Plain-language account of the last utterance, so a silent failure names itself. */
function describeStatus(status: SpeechStatus): string {
  switch (status.state) {
    case 'idle':
      return 'Nothing spoken yet.'
    case 'waiting':
      return 'Waiting for the browser to load its voices…'
    case 'blocked':
      return 'Chrome blocked audio until you interact — click anywhere to hear it.'
    case 'speaking':
      return `Speaking with ${status.voice}`
    case 'done':
      return `Last spoken with ${status.voice}`
    case 'no-audio':
      return `${status.voice} ${status.detail} — falling back to the next voice.`
    case 'error':
      return status.voice
        ? `${status.voice} failed: ${status.detail}`
        : `Speech failed: ${status.detail}`
    case 'unsupported':
      return 'This browser has no speech synthesis.'
  }
}

/** Spoken when testing a voice — short, and full of sounds that expose a bad one. */
const SAMPLE = "Bonjour, j'voudrais un café, s'il vous plaît"

export function SettingsPanel({
  voices,
  selectedVoice,
  onSelectVoice,
  rate,
  onSetRate,
  onSpeak,
  status,
  showPhonetic,
  onSetShowPhonetic,
}: SettingsPanelProps) {
  const [open, setOpen] = useState(false)
  const [debug, setDebug] = useState(isSpeechDebugEnabled)
  const [copied, setCopied] = useState(false)

  const lines = getSpeechLog()

  const copyLog = async () => {
    const report = [
      `voices: ${voices.length} total, ${voices.filter(isFrenchVoice).length} French`,
      `selected: ${selectedVoice ? `${selectedVoice.name} (${selectedVoice.lang})` : 'none'}`,
      `rate: ${rate}`,
      `userAgent: ${navigator.userAgent}`,
      '',
      ...voices.map((v) => `  · ${v.name} (${v.lang})${v.localService ? ' local' : ' remote'}`),
      '',
      ...lines,
    ].join('\n')
    try {
      await navigator.clipboard.writeText(report)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard blocked — the log is on screen to select by hand */
    }
  }

  // Only French voices are offered. An English voice reading French teaches the
  // wrong sounds, so it's never a real option — the engine falls back to one
  // only to avoid total silence, and that shows up as "no French voice" below.
  const frenchVoices = voices.filter(isFrenchVoice)
  const selectedIsFrench = selectedVoice ? isFrenchVoice(selectedVoice) : false

  return (
    <div className="settings">
      <button
        type="button"
        className="settings-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        ⚙︎ Settings
      </button>

      {open && (
        <div className="settings-body">
          {/* Everything that changes what the card shows. Speech, which changes
              what it sounds like, follows below. */}
          <section className="settings-section">
            <h2 className="settings-heading">Display</h2>

            <label className="settings-switch">
              <input
                type="checkbox"
                checked={showPhonetic}
                onChange={(e) => onSetShowPhonetic(e.target.checked)}
              />
              <span>Pronunciation line</span>
            </label>
            <p className="settings-note">
              The English-reader spelling of the sentence, under the French once you've answered.
            </p>
          </section>

          <section className="settings-section">
            <h2 className="settings-heading">Speech</h2>

            <label>
              Voice
              <select
                value={selectedVoice?.voiceURI ?? ''}
                onChange={(e) => {
                  const voice = voices.find((v) => v.voiceURI === e.target.value)
                  if (voice) onSelectVoice(voice)
                }}
                disabled={frenchVoices.length === 0}
              >
                {frenchVoices.length === 0 && <option value="">No French voice found</option>}
                {/* The engine fell back to a non-French voice; show it so the
                    dropdown isn't silently blank while something else speaks. */}
                {selectedVoice && !selectedIsFrench && (
                  <option value={selectedVoice.voiceURI}>
                    {selectedVoice.name} ({selectedVoice.lang}) — not French
                  </option>
                )}
                {frenchVoices.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang}){voice.localService ? '' : ' — online'}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Speed <span className="settings-value">{rate.toFixed(2)}×</span>
              <input
                type="range"
                min={MIN_SPEECH_RATE}
                max={MAX_SPEECH_RATE}
                step={0.05}
                value={rate}
                onChange={(e) => onSetRate(Number(e.target.value))}
              />
            </label>

            <button type="button" className="settings-test" onClick={() => onSpeak(SAMPLE)}>
              ▶ Test
            </button>

            {/* Silence is usually one of: no voices loaded at all, no French one,
                or a chosen voice that never speaks. Showing the counts says which. */}
            <p className="settings-note">
              {voices.length} voice{voices.length === 1 ? '' : 's'} available ·{' '}
              {frenchVoices.length} French
              <br />
              {describeStatus(status)}
            </p>

            {frenchVoices.length === 0 && (
              <p className="settings-warning">
                No French voice is installed, so the app is falling back to whatever it can find.
                On macOS: System Settings → Accessibility → Spoken Content → System Voice → Manage
                Voices, and add a French one. In Chrome, quit and reopen after installing.
              </p>
            )}
          </section>

          <section className="settings-section">
            <h2 className="settings-heading">Diagnostics</h2>

            <label className="settings-switch">
              <input
                type="checkbox"
                checked={debug}
                onChange={(e) => {
                  setSpeechDebugEnabled(e.target.checked)
                  setDebug(e.target.checked)
                }}
              />
              <span>Speech debug log{debug ? ' (also to console)' : ''}</span>
            </label>

            {debug && (
              <>
                <pre className="settings-log">
                  {lines.length === 0 ? 'No events yet — press Test.' : lines.join('\n')}
                </pre>
                <div className="settings-log-actions">
                  <button type="button" onClick={copyLog}>
                    {copied ? 'Copied' : 'Copy report'}
                  </button>
                  {/* clearSpeechLog notifies the hook, which re-renders us. */}
                  <button type="button" onClick={clearSpeechLog}>
                    Clear
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
