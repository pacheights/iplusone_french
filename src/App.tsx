import { useMemo, useState } from 'react'
import type { CardState, Grade, ReviewChoice } from './types'
import { CARDS } from './data/cards'
import { computeQueue } from './engine/deck'
import {
  GRADES,
  createCardState,
  describeInterval,
  gradeCard,
  previewSchedule,
  suspendCard,
} from './engine/srs'
import {
  loadReviewDefaults,
  loadShowPhonetic,
  loadSrsState,
  saveReviewDefaults,
  saveShowPhonetic,
  saveSrsState,
} from './engine/storage'
import { useSpeech } from './hooks/useSpeech'
import { FillBlankCard } from './components/FillBlankCard'
import { SettingsPanel } from './components/SettingsPanel'

/**
 * Bare shell: the deck, the scheduler, and audio. One fill-in-the-blank
 * question at a time. Everything that used to sit around it (listening track,
 * sidebar, settings, explanations) is gone — see git history to pull any of it
 * back.
 */
/** How many answers back Undo can walk. Deep enough for a slip, bounded so a
 *  long session doesn't hold every snapshot of the deck in memory. */
const UNDO_LIMIT = 20

function App() {
  const [states, setStates] = useState(() => loadSrsState())
  // The deck as it stood when the session opened, by id. A card's number is its
  // place in this list, so it keeps that number however many times it comes
  // back for a repeat — the count tracks progress through the deck, not answers
  // given. Frozen for the session: answering reshuffles the live queue, and a
  // total that moved underneath the learner would tell them nothing.
  const [sessionOrder] = useState(() => computeQueue(CARDS, states, new Date()).map((c) => c.id))
  // Undo restores the whole scheduler state as it stood before an answer, rather
  // than trying to invert the grade — FSRS isn't reversible from the new state
  // alone, and the queue is a pure function of these states, so putting them
  // back puts the card back. Session-only: reloading the page drops the stack.
  const [undoStack, setUndoStack] = useState<Record<string, CardState>[]>([])
  // Answering a card can leave it at the head of the queue (Again schedules it
  // for now), so the card id alone doesn't always change on undo. This does, and
  // it's in the card's key, so the card always remounts back to unanswered.
  const [undoEpoch, setUndoEpoch] = useState(0)
  const [defaults, setDefaults] = useState(() => loadReviewDefaults())
  const [showPhonetic, setShowPhoneticState] = useState(() => loadShowPhonetic())
  const { voices, selectedVoice, setSelectedVoice, rate, setRate, speak, status } = useSpeech()

  const queue = useMemo(() => computeQueue(CARDS, states, new Date()), [states])
  const currentCard = queue[0]

  // 0 for a card that wasn't in the deck at session start — nothing honest to
  // count it as, so the indicator sits it out rather than inventing a place.
  const position = currentCard ? sessionOrder.indexOf(currentCard.id) + 1 : 0

  // When each grade would bring this card back, worded for the buttons. Computed
  // against the card's state as it stands now, before the grade lands.
  const schedule = useMemo(() => {
    if (!currentCard) return null
    const now = new Date()
    const preview = previewSchedule(states[currentCard.id] ?? createCardState(now), now)
    const labels = {} as Record<Grade, string>
    for (const grade of GRADES) labels[grade] = describeInterval(preview[grade], now)
    return labels
  }, [currentCard, states])

  // Answering right or wrong picks the choice; the learner only intervenes when
  // that default is wrong about them — and then it stops being the default.
  const handleAnswer = (choice: ReviewChoice) => {
    if (!currentCard) return
    const now = new Date()
    const previous = states[currentCard.id] ?? createCardState(now)
    const nextStates = {
      ...states,
      [currentCard.id]:
        choice === 'never' ? suspendCard(previous) : gradeCard(previous, choice, now),
    }
    setUndoStack((stack) => [...stack, states].slice(-UNDO_LIMIT))
    setStates(nextStates)
    saveSrsState(nextStates)
  }

  // Back to the deck as it was before the last answer. The card that answer was
  // about becomes due again and returns to the head of the queue, unanswered.
  const undo = () => {
    const previous = undoStack[undoStack.length - 1]
    if (!previous) return
    setUndoStack((stack) => stack.slice(0, -1))
    setUndoEpoch((n) => n + 1)
    setStates(previous)
    saveSrsState(previous)
  }

  // Overriding teaches the app what that outcome should do from now on, so the
  // learner sets it once rather than on every card.
  const rememberDefault = (outcome: keyof typeof defaults, choice: ReviewChoice) => {
    const next = { ...defaults, [outcome]: choice }
    setDefaults(next)
    saveReviewDefaults(next)
  }

  const setShowPhonetic = (show: boolean) => {
    setShowPhoneticState(show)
    saveShowPhonetic(show)
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
        showPhonetic={showPhonetic}
        onSetShowPhonetic={setShowPhonetic}
      />

      <div className="stage">
        {/* Above the card and to its left, out of the way of the answer buttons.
            Always present rather than appearing with the first answer, so the
            card below it never shifts down a row. */}
        <div className="stage-bar">
          <button
            type="button"
            className="undo"
            onClick={undo}
            disabled={undoStack.length === 0}
            title="Undo the last answer"
          >
            ↶ Undo
          </button>

          {position > 0 && (
            <span className="progress">
              {position} <span className="progress-of">of</span> {sessionOrder.length}
            </span>
          )}
        </div>

        {currentCard && schedule ? (
          <FillBlankCard
            key={`${currentCard.id}:${undoEpoch}`}
            card={currentCard}
            onSpeak={speak}
            showPhonetic={showPhonetic}
            onAnswer={handleAnswer}
            schedule={schedule}
            defaults={defaults}
            onSetDefault={rememberDefault}
          />
        ) : (
          <p className="empty">Nothing due.</p>
        )}
      </div>
    </main>
  )
}

export default App
