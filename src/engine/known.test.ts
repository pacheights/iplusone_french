import { describe, expect, it } from 'vitest'
import { createKnownUnits, isReviewCard, knownUnitsFor } from './known'
import { createCardState } from './srs'
import { CARDS } from '../data/cards'
import type { Card, CardState } from '../types'

const now = new Date('2026-07-07T12:00:00Z')

/** Cards graded, in the order the deck hands them out. */
function seen(...ids: string[]): Record<string, CardState> {
  return Object.fromEntries(ids.map((id) => [id, createCardState(now)]))
}

describe('longest-match tiling', () => {
  it('covers a multi-token unit without covering its parts', () => {
    const known = createKnownUnits()
    known.learn(['un', 'peu'])
    expect(known.covers(['un', 'peu'])).toBe(true)
    expect(known.firstUnknown(['un', 'café'])).toBe('un')
  })
})

describe('which cards are review for this learner', () => {
  it('holds nothing known before the first card is graded', () => {
    const known = knownUnitsFor(CARDS, {})
    expect(CARDS.filter((c) => isReviewCard(c, known))).toEqual([])
  })

  it('counts a card as review once it has been seen — its own element included', () => {
    const first = CARDS[0]
    expect(isReviewCard(first, knownUnitsFor(CARDS, {}))).toBe(false)
    expect(isReviewCard(first, knownUnitsFor(CARDS, seen(first.id)))).toBe(true)
  })

  it('counts an unseen rest card as review when the cards behind it are graded', () => {
    // Walk the deck grading as we go; the first rest card reached must already
    // be review, because a rest card only re-uses what earlier cards taught.
    const states: Record<string, CardState> = {}
    let checked = false
    for (const card of CARDS) {
      if (!card.element) {
        expect(isReviewCard(card, knownUnitsFor(CARDS, states))).toBe(true)
        checked = true
        break
      }
      states[card.id] = createCardState(now)
    }
    expect(checked).toBe(true)
  })

  it('keeps a card teaching a new element out of review on first sight', () => {
    const states: Record<string, CardState> = {}
    for (const card of CARDS.slice(0, 12)) states[card.id] = createCardState(now)
    const known = knownUnitsFor(CARDS, states)

    const nextTeaching = CARDS.slice(12).find((c: Card) => c.element)
    expect(nextTeaching).toBeDefined()
    expect(isReviewCard(nextTeaching as Card, known)).toBe(false)
  })

  it('keeps a fixed expression out of review though every word in it is old', () => {
    // `ça va` is one unit, and both halves were taught long before it — so the
    // card is new material even though nothing on it is an unfamiliar word.
    const at = CARDS.findIndex((c) => c.element === 'ca_va')
    expect(at).toBeGreaterThan(0)
    const states: Record<string, CardState> = {}
    for (const card of CARDS.slice(0, at)) states[card.id] = createCardState(now)
    expect(isReviewCard(CARDS[at], knownUnitsFor(CARDS, states))).toBe(false)
  })
})
