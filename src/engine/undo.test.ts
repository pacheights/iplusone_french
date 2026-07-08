import { describe, expect, it } from 'vitest'
import { createCardState, gradeCard } from './srs'
import { countIntroducedToday } from './deck'
import type { CardState } from '../types'

/**
 * The undo flow in App.tsx is: on grade, remember the card's state *before* the
 * grade (undefined if brand-new); on undo, put that exact value back (or delete
 * the key if it was undefined). These tests pin the invariant that makes undo
 * correct — reversing a grade must restore the prior state byte-for-byte.
 */
const now = new Date('2026-07-07T12:00:00Z')

/** Mirror of App's handlers, isolated so the reversal logic is testable. */
function grade(states: Record<string, CardState>, id: string, g: 'again' | 'good') {
  const prevState = states[id]
  const next = gradeCard(prevState ?? createCardState(now), g, now)
  return { states: { ...states, [id]: next }, entry: { id, prevState } }
}
function undo(states: Record<string, CardState>, entry: { id: string; prevState: CardState | undefined }) {
  const restored = { ...states }
  if (entry.prevState === undefined) delete restored[entry.id]
  else restored[entry.id] = entry.prevState
  return restored
}

describe('undo restores state exactly', () => {
  it('undoing a brand-new card removes it and un-counts it as introduced', () => {
    const before: Record<string, CardState> = {}
    const graded = grade(before, 'c1', 'good')
    expect(countIntroducedToday(graded.states, now)).toBe(1)

    const after = undo(graded.states, graded.entry)
    expect(after).toEqual({})
    expect(countIntroducedToday(after, now)).toBe(0)
  })

  it('undoing a review card puts back its previous SRS state verbatim', () => {
    // A card already seen once.
    const seeded = grade({}, 'c1', 'good').states
    const snapshot = seeded.c1

    const graded = grade(seeded, 'c1', 'again') // lapse changes stability/reps/dueDate
    expect(graded.states.c1).not.toEqual(snapshot)

    const after = undo(graded.states, graded.entry)
    expect(after.c1).toEqual(snapshot)
  })

  it('supports multi-level undo (LIFO)', () => {
    let states: Record<string, CardState> = {}
    const g1 = grade(states, 'a', 'good'); states = g1.states
    const g2 = grade(states, 'b', 'good'); states = g2.states
    const g3 = grade(states, 'c', 'good'); states = g3.states

    states = undo(states, g3.entry)
    states = undo(states, g2.entry)
    states = undo(states, g1.entry)
    expect(states).toEqual({})
  })
})
