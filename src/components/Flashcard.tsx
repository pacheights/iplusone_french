import { useEffect, useState, type MouseEvent } from 'react'
import type { Card, Grade, Segment } from '../types'
import { cardText } from '../types'
import { elementById } from '../data/elements'
import { EXPLANATIONS } from '../data/explanations'
import { ExplanationModal } from './ExplanationModal'

interface FlashcardProps {
  card: Card
  onSpeak: (text: string) => void
  onGrade: (grade: Grade) => void
  speechUnlocked: boolean
  /** Highlight the target word on the English translation (reveal side). */
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
  const [explaining, setExplaining] = useState(false)

  // Reset to the front (listen) side whenever a new card appears. Done during
  // render rather than in an effect so the reset lands *before* the new card
  // paints — an effect runs after render, which would flash the previous card's
  // revealed answer for one frame when grading straight into the next card.
  const [shownCardId, setShownCardId] = useState(card.id)
  if (card.id !== shownCardId) {
    setShownCardId(card.id)
    setRevealed(false)
    setExplaining(false)
  }

  const explanation = EXPLANATIONS[card.id]

  // Listening-first: play the French the moment a new card surfaces, before the
  // learner sees anything. Keyed on card.id so it fires exactly once per card;
  // it never runs on reveal, so flipping to the answer stays silent. If speech
  // isn't unlocked yet (no user gesture on the page), this re-fires once it is.
  useEffect(() => {
    if (speechUnlocked) onSpeak(cardText(card))
    // onSpeak is stable per selected voice; re-running on its identity would
    // double-play, so we intentionally key only on the card and the unlock gate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.id, speechUnlocked])

  const stopAndRun = (fn: () => void) => (e: MouseEvent) => {
    e.stopPropagation()
    fn()
  }

  const speak = () => onSpeak(cardText(card))

  return (
    <>
      {/* Clicking the card body flips between the listen and reveal sides both
          ways. Buttons inside (replay, explain, grade) stopPropagation so they
          act without flipping. */}
      <div
        className="flashcard"
        onClick={() => setRevealed((r) => !r)}
        role="button"
        tabIndex={0}
        aria-label={revealed ? 'Back to listening side' : 'Reveal answer'}
      >
        {revealed ? (
          <Reveal
            card={card}
            highlightEnglish={highlightEnglish}
            onGrade={onGrade}
            stopAndRun={stopAndRun}
            onReplay={speak}
            onExplain={explanation ? () => setExplaining(true) : undefined}
          />
        ) : (
          <>
            <button
              type="button"
              className="listen-button"
              onClick={stopAndRun(speak)}
              aria-label="Replay audio"
            >
              🔊
            </button>
            <p className="listen-hint">Listen, then tap to reveal</p>
          </>
        )}
      </div>
      {explaining && explanation && (
        <ExplanationModal explanation={explanation} onClose={() => setExplaining(false)} />
      )}
    </>
  )
}

interface RevealProps {
  card: Card
  highlightEnglish: boolean
  onGrade: (grade: Grade) => void
  stopAndRun: (fn: () => void) => (e: MouseEvent) => void
  /** Replay the audio without flipping the card. */
  onReplay: () => void
  /** Open the explanation modal; omitted when this card has no explanation. */
  onExplain?: () => void
}

function Reveal({ card, highlightEnglish, onGrade, stopAndRun, onReplay, onExplain }: RevealProps) {
  const element = card.element ? elementById[card.element] : undefined

  return (
    <>
      <div className="reveal-actions">
        <button
          type="button"
          className="back-to-listen"
          onClick={stopAndRun(onReplay)}
          aria-label="Play audio again"
          title="Play audio again"
        >
          🔊 Listen again
        </button>
        {onExplain && (
          <button
            type="button"
            className="explain-button"
            onClick={stopAndRun(onExplain)}
            title="Explain this sentence"
          >
            💡 Explain
          </button>
        )}
      </div>
      <p className="flashcard-sentence">
        <Sentence segments={card.segments} />
      </p>
      <p className="flashcard-translation">
        <Sentence
          segments={
            highlightEnglish ? card.translation : card.translation.map((s) => ({ text: s.text }))
          }
        />
      </p>
      {element && (
        <p className="element-gloss">
          <span className="element-gloss-surface">{element.surface}</span> — {element.gloss}
        </p>
      )}
      {element?.note && <p className="grammar-note">{element.note}</p>}
      {card.note && <p className="grammar-note">{card.note}</p>}
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
  )
}
