import { useEffect, useMemo, useState } from 'react'
import type { ListeningChoice, ListeningItem } from '../types'
import { currentInCycle, nextInCycle, shuffle } from '../engine/listening'
import { loadListeningSeenIds, saveListeningSeenIds } from '../engine/storage'

interface ListeningTestProps {
  items: ListeningItem[]
  onSpeak: (text: string) => void
  speechUnlocked: boolean
}

interface Round {
  item: ListeningItem
  options: ListeningChoice[]
}

function toRound(item: ListeningItem): Round {
  return { item, options: shuffle([item.answer, ...item.distractors]) }
}

/** Resume the persisted question if there is one; otherwise start the cycle. */
function initialRound(items: ListeningItem[], seenIds: string[]): Round | null {
  const resumed = currentInCycle(items, seenIds)
  if (resumed) return toRound(resumed)
  const { item } = nextInCycle(items, seenIds)
  return item ? toRound(item) : null
}

export function ListeningTest({ items, onSpeak, speechUnlocked }: ListeningTestProps) {
  const [seenIds, setSeenIds] = useState<string[]>(() => loadListeningSeenIds())
  const [round, setRound] = useState<Round | null>(() => initialRound(items, seenIds))
  const [selected, setSelected] = useState<ListeningChoice | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  // If the pool grows from empty (first unlock while this view is mounted),
  // seed the first round.
  useEffect(() => {
    if (!round && items.length > 0) {
      const { item, seenIds: next } = nextInCycle(items, seenIds)
      if (item) {
        setRound(toRound(item))
        setSeenIds(next)
        saveListeningSeenIds(next)
      }
    }
  }, [items, round, seenIds])

  const position = useMemo(() => {
    if (!round) return null
    const total = items.length
    const index = seenIds.indexOf(round.item.id)
    return { current: index === -1 ? seenIds.length : index + 1, total }
  }, [round, seenIds, items.length])

  // Play the sentence whenever a new round starts. Gated on speechUnlocked so
  // the browser's autoplay block doesn't swallow the very first utterance;
  // once the user has interacted this re-runs and speaks the current sentence.
  const itemId = round?.item.id
  useEffect(() => {
    if (round && speechUnlocked) onSpeak(round.item.answer.text)
    // Keyed on the item id (+ unlock) so re-renders and voice changes don't
    // replay, but a new question does.
  }, [itemId, speechUnlocked])

  const revealed = selected !== null

  const choose = (option: ListeningChoice) => {
    if (revealed || !round) return
    setSelected(option)
    setScore((s) => ({
      correct: s.correct + (option === round.item.answer ? 1 : 0),
      total: s.total + 1,
    }))
  }

  const next = () => {
    setSelected(null)
    const { item, seenIds: nextSeenIds } = nextInCycle(items, seenIds)
    setRound(item ? toRound(item) : null)
    setSeenIds(nextSeenIds)
    saveListeningSeenIds(nextSeenIds)
  }

  const accuracy = useMemo(
    () => (score.total === 0 ? 0 : Math.round((score.correct / score.total) * 100)),
    [score],
  )

  if (!round) {
    return <p className="all-done">No listening questions are ready yet. Keep learning! 🎧</p>
  }

  const { item, options } = round

  return (
    <div className="listening">
      <div className="listening-head">
        <p className="listening-prompt">
          What did you hear?
          {position && (
            <span className="listening-position">
              {' '}
              ({position.current}/{position.total})
            </span>
          )}
        </p>
        {score.total > 0 && (
          <p className="listening-score">
            {score.correct}/{score.total} · {accuracy}%
          </p>
        )}
      </div>

      <button
        type="button"
        className="play-button listening-play"
        onClick={() => onSpeak(item.answer.text)}
        aria-label="Play the sentence again"
      >
        🔊 Play again
      </button>

      <div className="listening-options">
        {options.map((option, i) => {
          const isAnswer = option === item.answer
          const isPicked = option === selected
          const stateClass = !revealed
            ? ''
            : isAnswer
              ? ' option-correct'
              : isPicked
                ? ' option-wrong'
                : ' option-dimmed'
          return (
            <button
              key={i}
              type="button"
              className={`option-button${stateClass}`}
              onClick={() => choose(option)}
              disabled={revealed}
            >
              {option.translation}
            </button>
          )
        })}
      </div>

      {revealed && (
        <div className="listening-feedback">
          <p className={selected === item.answer ? 'feedback-correct' : 'feedback-wrong'}>
            {selected === item.answer ? '✅ Correct' : '❌ Not quite'}
          </p>
          <p className="feedback-answer" lang="fr">
            {item.answer.text}
          </p>
          <p className="feedback-gloss">{item.gloss}</p>
          <button type="button" className="listening-next" onClick={next}>
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
