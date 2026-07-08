import { describe, expect, it } from 'vitest'
import { createCardState, gradeCard, isDue } from './srs'
import type { Grade } from '../types'

const DAY = 86_400_000
const now = new Date('2026-07-07T12:00:00Z')

/** Days from `now` until the card is next due. */
function intervalDays(grade: Grade, from = createCardState(now)): number {
  const next = gradeCard(from, grade, now)
  return (new Date(next.dueDate).getTime() - now.getTime()) / DAY
}

describe('FSRS scheduling on first exposure', () => {
  it('spreads the four grades across very different timescales', () => {
    const again = intervalDays('again')
    const hard = intervalDays('hard')
    const good = intervalDays('good')
    const easy = intervalDays('easy')

    // The bug we fixed: SM-2 gave all four ~1 day. FSRS must fan them out.
    expect(again).toBeLessThan(hard)
    expect(hard).toBeLessThan(good)
    expect(good).toBeLessThan(easy)
  })

  it('lets a learner who already knows a word push it ~2 weeks out with "easy"', () => {
    expect(intervalDays('easy')).toBeGreaterThan(10)
  })

  it('brings a failed ("again") card back within the same day', () => {
    expect(intervalDays('again')).toBeLessThan(1)
  })

  it('schedules "good" a few days out and "hard" about a day', () => {
    expect(intervalDays('good')).toBeGreaterThan(2)
    expect(intervalDays('good')).toBeLessThan(6)
    expect(intervalDays('hard')).toBeLessThan(2)
  })
})

describe('FSRS scheduling over repeated reviews', () => {
  it('grows the interval each time a card is recalled', () => {
    let state = gradeCard(createCardState(now), 'good', now)
    let at = new Date(state.dueDate)
    let prev = 0
    for (let i = 0; i < 4; i++) {
      const before = new Date(at)
      state = gradeCard(state, 'good', at)
      const gap = (new Date(state.dueDate).getTime() - before.getTime()) / DAY
      expect(gap).toBeGreaterThan(prev)
      prev = gap
      at = new Date(state.dueDate)
    }
  })

  it('resets the recall streak but keeps the card known-then-forgotten via reps', () => {
    const learned = gradeCard(createCardState(now), 'good', now)
    expect(learned.reps).toBe(1)
    const lapsed = gradeCard(learned, 'again', new Date(learned.dueDate))
    expect(lapsed.reps).toBe(0)
  })

  it('marks a freshly graded card due only in the future', () => {
    const state = gradeCard(createCardState(now), 'good', now)
    expect(isDue(state, now)).toBe(false)
    expect(isDue(state, new Date(now.getTime() + 10 * DAY))).toBe(true)
  })
})
