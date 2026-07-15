import { useState } from 'react'
import { MAX_SPEECH_RATE, MIN_SPEECH_RATE } from '../engine/storage'

interface SettingsPanelProps {
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  onSelectVoice: (voice: SpeechSynthesisVoice) => void
  speechRate: number
  onSetSpeechRate: (rate: number) => void
  newWordsPerDay: number
  onSetNewWordsPerDay: (n: number) => void
  newWordsToday: number
  highlightEnglish: boolean
  onSetHighlightEnglish: (on: boolean) => void
}

export function SettingsPanel({
  voices,
  selectedVoice,
  onSelectVoice,
  speechRate,
  onSetSpeechRate,
  newWordsPerDay,
  onSetNewWordsPerDay,
  newWordsToday,
  highlightEnglish,
  onSetHighlightEnglish,
}: SettingsPanelProps) {
  const [open, setOpen] = useState(false)

  const sortedVoices = [...voices].sort((a, b) => {
    const aFrench = a.lang.toLowerCase().startsWith('fr')
    const bFrench = b.lang.toLowerCase().startsWith('fr')
    if (aFrench === bFrench) return 0
    return aFrench ? -1 : 1
  })

  return (
    <div className="settings">
      <button
        type="button"
        className="settings-button"
        aria-label="Settings"
        onClick={() => setOpen((o) => !o)}
      >
        ⚙️
      </button>

      {open && (
        <div className="settings-popover">
          <h2>New words per day</h2>
          <label className="new-words-field">
            <input
              type="number"
              min={1}
              max={200}
              value={newWordsPerDay}
              onChange={(e) => {
                const n = Math.floor(Number(e.target.value))
                if (Number.isFinite(n) && n > 0) onSetNewWordsPerDay(n)
              }}
            />
            <span className="new-words-today">
              {newWordsToday}/{newWordsPerDay} introduced today
            </span>
          </label>

          <h2>Display</h2>
          <label className="highlight-english-field">
            <input
              type="checkbox"
              checked={highlightEnglish}
              onChange={(e) => onSetHighlightEnglish(e.target.checked)}
            />
            <span>Highlight the target word in English</span>
          </label>

          <h2>Speech speed</h2>
          <label className="speech-rate-field">
            <input
              type="range"
              min={MIN_SPEECH_RATE}
              max={MAX_SPEECH_RATE}
              step={0.05}
              value={speechRate}
              onChange={(e) => onSetSpeechRate(Number(e.target.value))}
            />
            <span className="speech-rate-value">{speechRate.toFixed(2)}×</span>
          </label>

          <h2>Voice</h2>
          <ul className="voice-list">
            {sortedVoices.map((voice) => (
              <li key={voice.voiceURI}>
                <label>
                  <input
                    type="radio"
                    name="voice"
                    checked={selectedVoice?.voiceURI === voice.voiceURI}
                    onChange={() => onSelectVoice(voice)}
                  />
                  {voice.name} ({voice.lang})
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
