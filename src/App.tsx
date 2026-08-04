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
  loadListenFirstReviewsOnly,
  loadMuteMode,
  loadReviewDefaults,
  loadShowPhonetic,
  loadSrsState,
  saveListenFirst,
  saveListenFirstReviewsOnly,
  saveMuteMode,
  saveReviewDefaults,
  saveShowPhonetic,
  saveSrsState,
} from './engine/storage'
import { isReviewCard, knownUnitsFor } from './engine/known'
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

const CARD_BY_ID = new Map(CARDS.map((card) => [card.id, card]))

function App() {
  const [states, setStates] = useState(() => loadSrsState())
  // Undo walks back through the answers of this session, one press per answer.
  // Each entry restores the whole scheduler state as it stood before that
  // answer, rather than trying to invert the grade — FSRS isn't reversible from
  // the new state alone, and the queue is a pure function of these states, so
  // putting them back puts the deck back. Session-only: reloading drops the
  // stack. Each entry also carries the card that answer was about, for the
  // reason on `pinnedCardId` below.
  const [undoStack, setUndoStack] = useState<
    { cardId: string; states: Record<string, CardState> }[]
  >([])
  // Which card Undo put back. Restoring the states is not enough to return to
  // it: a card answered for the first time goes back to being unseen, and unseen
  // cards sit behind every due review, so the queue would hand back a different
  // card — stepping back through a session would wander rather than retrace it.
  // Undo means "that card again", so the card it undid is shown until the next
  // answer, when the queue takes over.
  const [pinnedCardId, setPinnedCardId] = useState<string | null>(null)
  // Answering a card can leave it at the head of the queue (Again schedules it
  // for now), so the card id alone doesn't always change on undo. This does, and
  // it's in the card's key, so the card always remounts back to unanswered.
  const [undoEpoch, setUndoEpoch] = useState(0)
  const [defaults, setDefaults] = useState(() => loadReviewDefaults())
  const [showPhonetic, setShowPhoneticState] = useState(() => loadShowPhonetic())
  const [muteMode, setMuteModeState] = useState(() => loadMuteMode())
  const [listenFirst, setListenFirstState] = useState(() => loadListenFirst())
  const [listenFirstReviewsOnly, setListenFirstReviewsOnlyState] = useState(() =>
    loadListenFirstReviewsOnly(),
  )
  const { voices, selectedVoice, setSelectedVoice, rate, setRate, speak, status } = useSpeech()

  const queue = useMemo(() => computeQueue(CARDS, states, new Date()), [states])
  const currentCard = (pinnedCardId ? CARD_BY_ID.get(pinnedCardId) : undefined) ?? queue[0]

  // Everything the learner has been introduced to, which moves only when a card
  // is graded — hence keyed on the states rather than on the card.
  const known = useMemo(() => knownUnitsFor(CARDS, states), [states])

  // Restricted to reviews, the cover comes down for a card carrying a word the
  // learner hasn't met: there is nothing to recognise, so it turns up flipped.
  const coverThisCard =
    listenFirst && (!listenFirstReviewsOnly || (!!currentCard && isReviewCard(currentCard, known)))

  // Every card the queue can hand back comes from CARDS, so this is only 0
  // between decks, when there is no card to number.
  const position = currentCard ? (DECK_POSITION.get(currentCard.id) ?? 0) : 0

  // The due reviews sit at the head of the queue, ahead of every card the
  // learner hasn't met, so counting them is counting how far it is back to the
  // place in the deck they left off at. A card carrying a state has been seen,
  // which is what puts it in the review half rather than the unseen one.
  const reviewsLeft = useMemo(
    () => queue.filter((card) => states[card.id]).length,
    [queue, states],
  )

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
    setUndoStack((stack) => [...stack, { cardId: currentCard.id, states }].slice(-UNDO_LIMIT))
    setPinnedCardId(null)
    setStates(nextStates)
    saveSrsState(nextStates)
  }

  // Back to the deck as it was before the last answer on the stack, showing the
  // card that answer was about, unanswered. Press again to take back the one
  // before it.
  const undo = () => {
    const previous = undoStack[undoStack.length - 1]
    if (!previous) return
    setUndoStack((stack) => stack.slice(0, -1))
    setPinnedCardId(previous.cardId)
    setUndoEpoch((n) => n + 1)
    setStates(previous.states)
    saveSrsState(previous.states)
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

  const setListenFirstReviewsOnly = (reviewsOnly: boolean) => {
    setListenFirstReviewsOnlyState(reviewsOnly)
    saveListenFirstReviewsOnly(reviewsOnly)
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
        listenFirstReviewsOnly={listenFirstReviewsOnly}
        onSetListenFirstReviewsOnly={setListenFirstReviewsOnly}
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
              {reviewsLeft > 0 && (
                <span className="progress-reviews">
                  {reviewsLeft} {reviewsLeft === 1 ? 'review' : 'reviews'} left
                </span>
              )}
            </span>
          )}
        </div>

        {currentCard && schedule ? (
          <FillBlankCard
            key={`${currentCard.id}:${undoEpoch}`}
            card={currentCard}
            onSpeak={speak}
            listenFirst={coverThisCard}
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
