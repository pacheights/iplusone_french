import { useMemo, useState } from 'react'
import { CARDS } from './data/cards'
import { computeQueue } from './engine/deck'
import { createCardState, gradeCard } from './engine/srs'
import { loadSrsState, saveSrsState } from './engine/storage'
import { useSpeech } from './hooks/useSpeech'
import { ClozeCard } from './components/ClozeCard'
import { SettingsPanel } from './components/SettingsPanel'

/**
 * Bare shell: the deck, the scheduler, and audio. One fill-in-the-blank
 * question at a time. Everything that used to sit around it (listening track,
 * sidebar, settings, explanations) is gone — see git history to pull any of it
 * back.
 */
function App() {
  const [states, setStates] = useState(() => loadSrsState())
  const { voices, selectedVoice, setSelectedVoice, rate, setRate, speak, status } = useSpeech()

  const queue = useMemo(() => computeQueue(CARDS, states, new Date()), [states])
  const currentCard = queue[0]

  // A cloze answer is binary, so it maps onto the two grades that matter:
  // getting it right schedules the card forward, getting it wrong resets it.
  const handleAnswer = (correct: boolean) => {
    if (!currentCard) return
    const now = new Date()
    const previous = states[currentCard.id] ?? createCardState(now)
    const nextStates = {
      ...states,
      [currentCard.id]: gradeCard(previous, correct ? 'good' : 'again', now),
    }
    setStates(nextStates)
    saveSrsState(nextStates)
  }

  return (
    <main id="app">
      <SettingsPanel
        voices={voices}
        selectedVoice={selectedVoice}
        onSelectVoice={setSelectedVoice}
        rate={rate}
        onSetRate={setRate}
        onSpeak={speak}
        status={status}
      />

      {currentCard ? (
        <ClozeCard
          key={currentCard.id}
          card={currentCard}
          onSpeak={speak}
          onAnswer={handleAnswer}
        />
      ) : (
        <p className="empty">Nothing due.</p>
      )}
    </main>
  )
}

export default App
