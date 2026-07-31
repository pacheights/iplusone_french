import { useEffect } from 'react'
import type { Card } from '../types'
import { cardText } from '../types'
import { explanationFor } from '../data/explanations'

interface ExplainPanelProps {
  card: Card
  onClose: () => void
}

/**
 * The whole card, taken apart: what the sentence says, every part of it in
 * reading order, then what the parts add up to. The content lives in
 * data/explanations.ts — this only lays it out.
 *
 * The card itself stays clean and teaches one form (rules.md); the panel is
 * where the load goes.
 */
export function ExplainPanel({ card, onClose }: ExplainPanelProps) {
  const explanation = explanationFor(card.id)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!explanation) return null

  return (
    // Clicking the backdrop closes; clicks inside the panel are stopped so a
    // drag-select of the text doesn't dismiss it.
    <div className="explain-backdrop" onClick={onClose} role="presentation">
      <div
        className="explain"
        role="dialog"
        aria-modal="true"
        aria-label="Explanation"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="explain-head">
          <h2 className="explain-title">Explanation</h2>
          <button type="button" className="explain-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <p className="explain-sentence">{cardText(card)}</p>
        <p className="explain-summary">{explanation.summary}</p>

        <ol className="explain-parts">
          {explanation.parts.map((part, i) => (
            <li key={i}>
              <span className="explain-part">{part.part}</span>
              <span className="explain-note">{part.note}</span>
            </li>
          ))}
        </ol>

        {explanation.whole && <p className="explain-whole">{explanation.whole}</p>}
      </div>
    </div>
  )
}
