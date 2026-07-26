import { useEffect, type ReactNode } from 'react'

interface ExplanationModalProps {
  /** Markdown-subset explanation text (see data/explanations.ts). */
  explanation: string
  onClose: () => void
}

/** Inline formatting — only **bold** is supported, which keeps this tiny and safe. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

/** Render the markdown subset: blank-line paragraphs and "- " bullet lists. */
function Rendered({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\n+/)
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split('\n')
        if (lines.every((l) => l.startsWith('- '))) {
          return (
            <ul key={i} className="explanation-list">
              {lines.map((l, j) => (
                <li key={j}>{inline(l.slice(2))}</li>
              ))}
            </ul>
          )
        }
        return <p key={i}>{inline(block)}</p>
      })}
    </>
  )
}

/** A Win95-style dialog explaining the current sentence's components. */
export function ExplanationModal({ explanation, onClose }: ExplanationModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Explanation"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-titlebar">
          <span className="modal-title">EXPLANATION</span>
          <button type="button" className="modal-x" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="modal-body">
          <Rendered text={explanation} />
        </div>
        <div className="modal-foot">
          <button type="button" className="modal-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
