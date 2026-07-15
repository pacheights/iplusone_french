import { useEffect, useMemo, useState } from 'react'
import { CARDS } from './data/cards'
import { LISTENING_ITEMS } from './data/listening'
import { computeQueue, countIntroducedToday, getLearnedElements } from './engine/deck'
import {
  availableItems,
  getKnownElementIds,
  LISTENING_UNLOCK_COUNT,
} from './engine/listening'
import { createCardState, gradeCard } from './engine/srs'
import {
  loadHighlightEnglish,
  loadNewWordsPerDay,
  loadSrsState,
  saveHighlightEnglish,
  saveNewWordsPerDay,
  saveSrsState,
} from './engine/storage'
import { useSpeech } from './hooks/useSpeech'
import { Flashcard } from './components/Flashcard'
import { ListeningTest } from './components/ListeningTest'
import { SettingsPanel } from './components/SettingsPanel'
import { Sidebar } from './components/Sidebar'
import type { Card, CardState, Grade } from './types'

type View = 'learn' | 'listen'

/** One undo step: the card graded and its SRS state *before* that grade (undefined if it was brand-new). */
interface HistoryEntry {
  card: Card
  prevState: CardState | undefined
}

function App() {
  const [states, setStates] = useState(() => loadSrsState())
  const [history, setHistory] = useState<HistoryEntry[]>([])
  // After an undo, the queue no longer surfaces the card we just restored (its
  // due date is in the past but other cards may sort ahead, or it's new again),
  // so we pin it explicitly until it's re-graded.
  const [forcedCard, setForcedCard] = useState<Card | null>(null)
  const [view, setView] = useState<View>('learn')
  const [newWordsPerDay, setNewWordsPerDayState] = useState(() => loadNewWordsPerDay())
  const [highlightEnglish, setHighlightEnglishState] = useState(() => loadHighlightEnglish())
  const { voices, selectedVoice, setSelectedVoice, rate, setRate, speak, unlocked } = useSpeech()

  const setNewWordsPerDay = (n: number) => {
    setNewWordsPerDayState(n)
    saveNewWordsPerDay(n)
  }

  const setHighlightEnglish = (on: boolean) => {
    setHighlightEnglishState(on)
    saveHighlightEnglish(on)
  }

  const queue = useMemo(
    () => computeQueue(CARDS, states, new Date(), newWordsPerDay),
    [states, newWordsPerDay],
  )
  const currentCard = forcedCard ?? queue[0]
  const reviewCount = queue.filter((c) => states[c.id]).length
  const newCount = queue.length - reviewCount
  const learned = useMemo(() => getLearnedElements(CARDS, states), [states])
  const newWordsToday = useMemo(() => countIntroducedToday(states, new Date()), [states])

  const known = useMemo(() => getKnownElementIds(CARDS, states), [states])
  const listeningPool = useMemo(() => availableItems(LISTENING_ITEMS, known), [known])
  const listenUnlocked = known.size >= LISTENING_UNLOCK_COUNT
  const activeView: View = view === 'listen' && !listenUnlocked ? 'learn' : view

  const handleGrade = (grade: Grade) => {
    if (!currentCard) return
    const now = new Date()
    const previousState = states[currentCard.id]
    const nextState = gradeCard(previousState ?? createCardState(now), grade, now)
    const nextStates = { ...states, [currentCard.id]: nextState }
    setStates(nextStates)
    saveSrsState(nextStates)
    setHistory((h) => [...h, { card: currentCard, prevState: previousState }])
    setForcedCard(null)
  }

  const handleUndo = () => {
    setHistory((h) => {
      if (h.length === 0) return h
      const last = h[h.length - 1]
      const nextStates = { ...states }
      // Restore the exact pre-grade state — delete the key entirely if the card
      // was brand-new (so its "introduced today" tally decrements too).
      if (last.prevState === undefined) delete nextStates[last.card.id]
      else nextStates[last.card.id] = last.prevState
      setStates(nextStates)
      saveSrsState(nextStates)
      setForcedCard(last.card)
      return h.slice(0, -1)
    })
  }

  // Cmd/Ctrl+Z undoes the last grade, matching the on-screen button.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        handleUndo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

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
          speechRate={rate}
          onSetSpeechRate={setRate}
          newWordsPerDay={newWordsPerDay}
          onSetNewWordsPerDay={setNewWordsPerDay}
          newWordsToday={newWordsToday}
          highlightEnglish={highlightEnglish}
          onSetHighlightEnglish={setHighlightEnglish}
        />
      </div>

      <main className="deck">
        {activeView === 'learn' && history.length > 0 && (
          <button
            type="button"
            className="undo-button"
            onClick={handleUndo}
            title="Undo last grade (⌘/Ctrl+Z)"
          >
            ↶ Undo
          </button>
        )}
        {activeView === 'learn' && currentCard && (
          <div className="cards-remaining">
            <span className="cards-remaining-total">
              {queue.length} {queue.length === 1 ? 'card' : 'cards'} left
            </span>
            <span className="cards-remaining-breakdown">
              {reviewCount} reviewing · {newCount} new
            </span>
          </div>
        )}
        {activeView === 'listen' ? (
          <ListeningTest items={listeningPool} onSpeak={speak} speechUnlocked={unlocked} />
        ) : currentCard ? (
          <Flashcard
            card={currentCard}
            onSpeak={speak}
            onGrade={handleGrade}
            speechUnlocked={unlocked}
            highlightEnglish={highlightEnglish}
          />
        ) : (
          <p className="all-done">You're all caught up. 🎉</p>
        )}
      </main>
    </div>
  )
}

export default App
