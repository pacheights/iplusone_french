import { describe, expect, it } from 'vitest'
import { computeQueue } from './deck'
import { createCardState, gradeCard, suspendCard } from './srs'
import type { Card, CardState } from '../types'

const now = new Date('2026-07-07T12:00:00Z')
const later = new Date('2027-07-07T12:00:00Z')

const card = (id: string): Card => ({
  id,
  segments: [{ text: id }],
  translation: [{ text: id }],
})

const cards = [card('a'), card('b'), card('c')]

describe('retiring a card with "never"', () => {
  it('takes a learned card out of the queue however long it sits there', () => {
    const learned: Record<string, CardState> = {
      a: gradeCard(createCardState(now), 'good', now),
    }
    expect(computeQueue(cards, learned, later).map((c) => c.id)).toContain('a')

    const retired = { a: suspendCard(learned.a) }
    expect(computeQueue(cards, retired, later).map((c) => c.id)).not.toContain('a')
  })

  it('keeps a card retired on first sight from coming back as a new card', () => {
    const states = { a: suspendCard(createCardState(now)) }
    expect(computeQueue(cards, states, later).map((c) => c.id)).toEqual(['b', 'c'])
  })

  it('leaves the memory state intact, so putting the card back resumes it', () => {
    const learned = gradeCard(createCardState(now), 'easy', now)
    const retired = suspendCard(learned)
    expect({ ...retired, suspended: undefined }).toEqual({ ...learned, suspended: undefined })

    const { suspended: _, ...resumed } = retired
    expect(computeQueue(cards, { a: resumed as CardState }, later).map((c) => c.id)).toContain('a')
  })
})
