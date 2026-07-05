import { useState } from 'react'
import type { Element } from '../types'

interface SidebarProps {
  learned: Element[]
}

export function Sidebar({ learned }: SidebarProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="sidebar">
      <button
        type="button"
        className="sidebar-button"
        aria-label="Words learned"
        onClick={() => setOpen((o) => !o)}
      >
        📖 {learned.length}
      </button>

      {open && (
        <div className="sidebar-panel">
          <h2>Learned ({learned.length})</h2>
          {learned.length === 0 ? (
            <p className="sidebar-empty">Grade your first card to start building this list.</p>
          ) : (
            <ul className="learned-list">
              {learned.map((el) => (
                <li key={el.id}>
                  <span className={`highlight-${el.kind}`}>{el.surface}</span>
                  <span className="learned-gloss">{el.gloss}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
