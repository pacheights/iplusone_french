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
  loadListenFirst,
  loadMuteMode,
  loadReviewDefaults,
  loadShowPhonetic,
  loadSrsState,
  saveListenFirst,
  saveMuteMode,
  saveReviewDefaults,
  saveShowPhonetic,
  saveSrsState,
} from './engine/storage'
import { useSpeech } from './hooks/useSpeech'
import { FillBlankCard } from './components/FillBlankCard'
import { SettingsPanel } from './components/SettingsPanel'

/**
 * Bare shell: the deck, the scheduler, and audio. One fill-in-the-blank
 * question at a time, with settings above it. The listening track and the
 * sidebar that used to sit around it are gone — see git history to pull either
 * back.
 */
/** How many answers back Undo can walk. Deep enough for a slip, bounded so a
 *  long session doesn't hold every snapshot of the deck in memory. */
const UNDO_LIMIT = 20

/** Where each card sits in the deck, 1-based. The indicator counts against the
 *  whole deck rather than the session, so a card's number is the same every
 *  time it comes up and the total never moves. */
const DECK_POSITION = new Map(CARDS.map((card, i) => [card.id, i + 1]))

function App() {
  const [states, setStates] = useState(() => loadSrsState())
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
  const [muteMode, setMuteModeState] = useState(() => loadMuteMode())
  const [listenFirst, setListenFirstState] = useState(() => loadListenFirst())
  const { voices, selectedVoice, setSelectedVoice, rate, setRate, speak, status } = useSpeech()

  const queue = useMemo(() => computeQueue(CARDS, states, new Date()), [states])
  const currentCard = queue[0]

  // Every card the queue can hand back comes from CARDS, so this is only 0
  // between decks, when there is no card to number.
  const position = currentCard ? (DECK_POSITION.get(currentCard.id) ?? 0) : 0

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

  const setMuteMode = (mute: boolean) => {
    setMuteModeState(mute)
    saveMuteMode(mute)
  }

  const setListenFirst = (listen: boolean) => {
    setListenFirstState(listen)
    saveListenFirst(listen)
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
        muteMode={muteMode}
        onSetMuteMode={setMuteMode}
        listenFirst={listenFirst}
        onSetListenFirst={setListenFirst}
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
              {position} <span className="progress-of">of</span> {CARDS.length}
            </span>
          )}
        </div>

        {currentCard && schedule ? (
          <FillBlankCard
            key={`${currentCard.id}:${undoEpoch}`}
            card={currentCard}
            onSpeak={speak}
            listenFirst={listenFirst}
            showPhonetic={showPhonetic}
            muteMode={muteMode}
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
