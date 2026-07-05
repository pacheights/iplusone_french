import type { Card, CardState, ListeningItem } from '../types'

/**
 * How many elements must be known before the listening track unlocks. The user
 * needs a real foundation to choose between confusable sentences, so we wait for
 * roughly the first fifteen words to stick.
 */
export const LISTENING_UNLOCK_COUNT = 15

/**
 * Element ids the learner actually knows — cards graded good/easy (or hard)
 * that haven't since lapsed. `repetitions` climbs on every non-"again" grade and
 * resets to 0 on "again", so `repetitions >= 1` is exactly "recalled at least
 * once and not currently forgotten." A single "again" drops the word back out of
 * the listening vocabulary until it's re-learned.
 */
export function getKnownElementIds(
  cards: Card[],
  states: Record<string, CardState>,
): Set<string> {
  const known = new Set<string>()
  for (const card of cards) {
    const state = states[card.id]
    if (state && state.repetitions >= 1) known.add(card.element)
  }
  return known
}

/** Items whose every required element is currently known. */
export function availableItems(items: ListeningItem[], known: Set<string>): ListeningItem[] {
  return items.filter((item) => item.requires.every((id) => known.has(id)))
}

/**
 * Shuffle-bag cycling: pick the next item such that every item in `pool` is
 * shown exactly once before any repeats, then the cycle resets. `seenIds` is
 * the ids already shown in the current cycle (in order, so its *last* entry
 * is "the question currently on screen" — this is what makes position
 * restorable after a refresh or a switch back from the Learn tab).
 *
 * Returns the chosen item plus the updated seenIds to persist. Returns a
 * null item for an empty pool (seenIds passed through unchanged).
 */
export function nextInCycle(
  pool: ListeningItem[],
  seenIds: string[],
): { item: ListeningItem | null; seenIds: string[] } {
  if (pool.length === 0) return { item: null, seenIds: [] }

  const poolIds = new Set(pool.map((i) => i.id))
  const seen = seenIds.filter((id) => poolIds.has(id)) // drop ids that lapsed out of the pool
  const lastShown = seen[seen.length - 1]

  let remaining = pool.filter((i) => !seen.includes(i.id))
  let base = seen
  if (remaining.length === 0) {
    // Every item in the pool has been shown — start a fresh cycle, but still
    // avoid immediately repeating the last question if there's a choice.
    remaining = pool.length > 1 ? pool.filter((i) => i.id !== lastShown) : pool
    base = []
  }

  const item = remaining[Math.floor(Math.random() * remaining.length)]
  return { item, seenIds: [...base, item.id] }
}

/**
 * Given persisted `seenIds` (see `nextInCycle`), the item currently on
 * screen is its last entry — as long as that item is still in the pool.
 * Returns null if there's no valid current item (fresh start, or the item
 * lapsed out of the pool), meaning the caller should call `nextInCycle`.
 */
export function currentInCycle(pool: ListeningItem[], seenIds: string[]): ListeningItem | null {
  const currentId = seenIds[seenIds.length - 1]
  if (!currentId) return null
  return pool.find((i) => i.id === currentId) ?? null
}

/** Fisher–Yates shuffle, returning a new array (used to order the choices). */
export function shuffle<T>(items: readonly T[]): T[] {
  const out = items.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}
