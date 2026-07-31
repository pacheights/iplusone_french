import type { Card, CardState } from '../types'
import { isDue } from './srs'

/**
 * Due reviews first, oldest due date first, then the cards never seen before in
 * deck order.
 *
 * Due reviews are never capped — spaced repetition depends on seeing them on
 * schedule.
 *
 * Suspended cards are out of both halves: a card the learner retired has a
 * state, which keeps it out of the unseen pile, and the check below keeps it
 * out of the due pile however long it sits there.
 */
export function computeQueue(
  cards: Card[],
  states: Record<string, CardState>,
  now: Date,
): Card[] {
  const dueReviews = cards
    .filter((card) => states[card.id] && !states[card.id].suspended && isDue(states[card.id], now))
    .sort(
      (a, b) =>
        new Date(states[a.id].dueDate).getTime() -
        new Date(states[b.id].dueDate).getTime(),
    )

  const unseen = cards.filter((card) => !states[card.id])

  return [...dueReviews, ...unseen]
}
