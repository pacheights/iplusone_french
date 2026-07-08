import type { Card, CardState, Element } from '../types'
import { elementById } from '../data/elements'
import { isDue, localDateKey } from './srs'

/** How many distinct cards were first introduced on the learner's local `now` day. */
export function countIntroducedToday(states: Record<string, CardState>, now: Date): number {
  const today = localDateKey(now)
  return Object.values(states).filter((s) => s.introducedDate === today).length
}

/**
 * Due reviews are never capped — spaced repetition depends on seeing them on
 * schedule. Only brand-new (never-graded) cards are capped by
 * `newWordsPerDay`, so a learner can't blow through the whole deck in one
 * sitting. Defaults to unlimited.
 */
export function computeQueue(
  cards: Card[],
  states: Record<string, CardState>,
  now: Date,
  newWordsPerDay: number = Infinity,
): Card[] {
  const dueReviews = cards
    .filter((card) => states[card.id] && isDue(states[card.id], now))
    .sort(
      (a, b) =>
        new Date(states[a.id].dueDate).getTime() -
        new Date(states[b.id].dueDate).getTime(),
    )

  const unseen = cards.filter((card) => !states[card.id])
  const remainingToday = Math.max(0, newWordsPerDay - countIntroducedToday(states, now))

  return [...dueReviews, ...unseen.slice(0, remainingToday)]
}

/** Elements from cards that have been reviewed at least once, in the order they were introduced. */
export function getLearnedElements(cards: Card[], states: Record<string, CardState>): Element[] {
  return cards
    .filter((card) => states[card.id])
    .map((card) => (card.element ? elementById[card.element] : undefined))
    .filter((el): el is Element => Boolean(el))
}
