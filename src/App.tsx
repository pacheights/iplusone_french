import { useMemo, useState } from 'react'
import { CARDS } from './data/cards'
import { LISTENING_ITEMS } from './data/listening'
import { computeQueue, countIntroducedToday, getLearnedElements } from './engine/deck'
import {
  availableItems,
  getKnownElementIds,
  LISTENING_UNLOCK_COUNT,
} from './engine/listening'
import { createCardState, gradeCard } from './engine/srs'
import { loadNewWordsPerDay, loadSrsState, saveNewWordsPerDay, saveSrsState } from './engine/storage'
import { useSpeech } from './hooks/useSpeech'
import { Flashcard } from './components/Flashcard'
import { ListeningTest } from './components/ListeningTest'
import { SettingsPanel } from './components/SettingsPanel'
import { Sidebar } from './components/Sidebar'
import type { Grade } from './types'

type View = 'learn' | 'listen'

function App() {
  const [states, setStates] = useState(() => loadSrsState())
  const [view, setView] = useState<View>('learn')
  const [newWordsPerDay, setNewWordsPerDayState] = useState(() => loadNewWordsPerDay())
  const { voices, selectedVoice, setSelectedVoice, speak, unlocked } = useSpeech()

  const setNewWordsPerDay = (n: number) => {
    setNewWordsPerDayState(n)
    saveNewWordsPerDay(n)
  }

  const queue = useMemo(
    () => computeQueue(CARDS, states, new Date(), newWordsPerDay),
    [states, newWordsPerDay],
  )
  const currentCard = queue[0]
  const learned = useMemo(() => getLearnedElements(CARDS, states), [states])
  const newWordsToday = useMemo(() => countIntroducedToday(states, new Date()), [states])

  const known = useMemo(() => getKnownElementIds(CARDS, states), [states])
  const listeningPool = useMemo(() => availableItems(LISTENING_ITEMS, known), [known])
  const listenUnlocked = known.size >= LISTENING_UNLOCK_COUNT
  const activeView: View = view === 'listen' && !listenUnlocked ? 'learn' : view

  const handleGrade = (grade: Grade) => {
    if (!currentCard) return
    const now = new Date()
    const previousState = states[currentCard.id] ?? createCardState(now)
    const nextState = gradeCard(previousState, grade, now)
    const nextStates = { ...states, [currentCard.id]: nextState }
    setStates(nextStates)
    saveSrsState(nextStates)
  }

  return (
    <div id="app">
      <div className="topbar">
        <Sidebar learned={learned} />

        <nav className="view-nav">
          <button
            type="button"
            className={activeView === 'learn' ? 'view-tab view-tab-active' : 'view-tab'}
            onClick={() => setView('learn')}
          >
            Learn
          </button>
          <button
            type="button"
            className={activeView === 'listen' ? 'view-tab view-tab-active' : 'view-tab'}
            onClick={() => setView('listen')}
            disabled={!listenUnlocked}
            title={
              listenUnlocked
                ? 'Listening comprehension'
                : `Unlocks at ${LISTENING_UNLOCK_COUNT} words learned (${known.size}/${LISTENING_UNLOCK_COUNT})`
            }
          >
            {listenUnlocked ? '🎧 Listen' : `🔒 Listen ${known.size}/${LISTENING_UNLOCK_COUNT}`}
          </button>
        </nav>

        <SettingsPanel
          voices={voices}
          selectedVoice={selectedVoice}
          onSelectVoice={setSelectedVoice}
          newWordsPerDay={newWordsPerDay}
          onSetNewWordsPerDay={setNewWordsPerDay}
          newWordsToday={newWordsToday}
        />
      </div>

      <main className="deck">
        {activeView === 'listen' ? (
          <ListeningTest items={listeningPool} onSpeak={speak} speechUnlocked={unlocked} />
        ) : currentCard ? (
          <Flashcard card={currentCard} onSpeak={speak} onGrade={handleGrade} speechUnlocked={unlocked} />
        ) : (
          <p className="all-done">You're all caught up. 🎉</p>
        )}
      </main>
    </div>
  )
}

export default App
