import { useEffect, useMemo, useState } from 'react'
import type { Card } from '../types'
import { cardSpeech, cardText } from '../types'
import { buildCloze } from '../engine/cloze'
import { CARDS } from '../data/cards'

interface ClozeCardProps {
  card: Card
  onSpeak: (text: string) => void
  /** Called once the learner has answered and moves on; `correct` drives the grade. */
  onAnswer: (correct: boolean) => void
}

export function ClozeCard({ card, onSpeak, onAnswer }: ClozeCardProps) {
  const question = useMemo(() => buildCloze(card, CARDS), [card])
  const [picked, setPicked] = useState<string | null>(null)

  // Reset for a new card during render rather than in an effect, so the reset
  // lands before the new card paints — an effect runs after render, which would
  // flash the previous card's answered state for one frame.
  const [shownCardId, setShownCardId] = useState(card.id)
  if (card.id !== shownCardId) {
    setShownCardId(card.id)
    setPicked(null)
  }

  const speak = () => onSpeak(cardSpeech(card))

  // The sentence is spoken the moment the question loads — the audio is what
  // tells you which of the four words belongs in the gap. No gate: if the
  // browser refuses for want of a user activation, useSpeech parks the text and
  // delivers it on the next interaction, so nothing is lost and nothing is
  // asked of the learner.
  useEffect(() => {
    onSpeak(cardSpeech(card))
    // onSpeak is stable per selected voice; re-running on its identity would
    // double-play, so we key only on the card.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.id])

  const answered = picked !== null
  const correct = picked === question.answer

  // Replay on answering: the first hearing was the question, with a gap the
  // learner was trying to fill. This one lands against the complete sentence
  // now visible on screen, which is when the sound and the words connect.
  const choose = (choice: string) => {
    if (answered) return
    setPicked(choice)
    speak()
  }

  const choiceClass = (choice: string) => {
    if (!answered) return 'choice'
    if (choice === question.answer) return 'choice choice-correct'
    if (choice === picked) return 'choice choice-wrong'
    return 'choice choice-muted'
  }

  return (
    <div className="card">
      {/* The sentence still plays by itself when the card loads; this is for
          hearing it again, and it doubles as the way in when the browser
          refused the automatic play for want of a user gesture. */}
      <button type="button" className="play" onClick={speak} aria-label="Play sentence">
        ▶
      </button>

      <p className="french">
        {answered ? (
          cardText(card)
        ) : (
          <>
            {question.before}
            <span className="blank">{'_'.repeat(Math.max(4, question.answer.length))}</span>
            {question.after}
          </>
        )}
      </p>

      {/* The translation already marks the English counterpart of the new
          element — the same word the gap took out — so bolding the highlighted
          segments points at the gloss of the word just filled in. A rest card
          highlights nothing and reads plain. */}
      {answered && (
        <p className="english">
          {card.translation.map((segment, i) =>
            segment.highlight ? (
              <strong key={i} className="gloss-target">
                {segment.text}
              </strong>
            ) : (
              <span key={i}>{segment.text}</span>
            ),
          )}
        </p>
      )}

      <div className="choices">
        {question.choices.map((choice) => (
          <button
            key={choice}
            type="button"
            className={choiceClass(choice)}
            onClick={() => choose(choice)}
            disabled={answered}
          >
            {choice}
          </button>
        ))}
      </div>

      {answered && (
        <button type="button" className="next" onClick={() => onAnswer(correct)}>
          {correct ? 'Correct — next' : 'Next'}
        </button>
      )}
    </div>
  )
}
