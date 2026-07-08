import { useEffect, useState, type MouseEvent } from 'react'
import type { Card, Grade, Segment } from '../types'
import { cardText } from '../types'
import { elementById } from '../data/elements'

interface FlashcardProps {
  card: Card
  onSpeak: (text: string) => void
  onGrade: (grade: Grade) => void
  speechUnlocked: boolean
  /** Highlight the target word on the English (front) side too. */
  highlightEnglish: boolean
}

function Sentence({ segments }: { segments: Segment[] }) {
  return (
    <>
      {segments.map((segment, i) => (
        <span key={i} className={segment.highlight ? `highlight-${segment.highlight}` : undefined}>
          {segment.text}
        </span>
      ))}
    </>
  )
}

export function Flashcard({ card, onSpeak, onGrade, speechUnlocked, highlightEnglish }: FlashcardProps) {
  const [revealed, setRevealed] = useState(false)

  // Reset to the front (English) whenever a new card appears.
  useEffect(() => {
    setRevealed(false)
  }, [card.id])

  const stopAndRun = (fn: () => void) => (e: MouseEvent) => {
    e.stopPropagation()
    fn()
  }

  // Speak the French only on an actual user-initiated flip to the back, not via
  // an effect keyed on `revealed` — that would fire with the *previous* card's
  // stale revealed=true the instant card.id changes (before the reset effect
  // above catches up), playing once spuriously on mount and once again on the
  // real reveal.
  const flip = () => {
    setRevealed((r) => {
      const next = !r
      if (next && speechUnlocked) onSpeak(cardText(card))
      return next
    })
  }

  const element = card.element ? elementById[card.element] : undefined

  return (
    <div
      className="flashcard"
      onClick={flip}
      role="button"
      tabIndex={0}
      aria-label={revealed ? 'Show front of card' : 'Show back of card'}
    >
      {revealed ? (
        <>
          <p className="flashcard-sentence">
            <Sentence segments={card.segments} />
          </p>
          {element && (
            <p className="element-gloss">
              <span className="element-gloss-surface">{element.surface}</span> — {element.gloss}
            </p>
          )}
          {element?.note && <p className="grammar-note">{element.note}</p>}
          {card.note && <p className="grammar-note">{card.note}</p>}
          <button
            type="button"
            className="play-button"
            onClick={stopAndRun(() => onSpeak(cardText(card)))}
            aria-label="Play sentence"
          >
            🔊 Play
          </button>
          <div className="grade-buttons">
            <button type="button" className="grade-again" onClick={stopAndRun(() => onGrade('again'))}>
              Again
            </button>
            <button type="button" className="grade-hard" onClick={stopAndRun(() => onGrade('hard'))}>
              Hard
            </button>
            <button type="button" className="grade-good" onClick={stopAndRun(() => onGrade('good'))}>
              Good
            </button>
            <button type="button" className="grade-easy" onClick={stopAndRun(() => onGrade('easy'))}>
              Easy
            </button>
          </div>
        </>
      ) : (
        <p className="flashcard-sentence">
          <Sentence
            segments={
              highlightEnglish ? card.translation : card.translation.map((s) => ({ text: s.text }))
            }
          />
        </p>
      )}
    </div>
  )
}
