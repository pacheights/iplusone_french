import type { Card, CardState, Element } from '../types'
import { elementById } from '../data/elements'
import { tokenize } from './tokenize'

/**
 * What the learner has already been introduced to, and whether a given sentence
 * stays inside it.
 *
 * The deck's own i+1 guarantee (engine/i1.ts) is about deck *order*: card 90's
 * sentence is built from words cards 1–89 taught. This is about one learner's
 * *progress* through that order — which of those cards they have actually been
 * shown. The two come apart on the first sight of any card, which is exactly
 * where the answer matters: a card teaching a new element is new material to
 * this learner, while a card whose every word came from cards already behind
 * them is review, however far down the deck it sits.
 *
 * Known units may be multi-token (the chunk "un peu", the bundled "le bus"), so
 * coverage is longest-match tiling rather than a bag of words — the same
 * reasoning as the validator, and the same code.
 */
export interface KnownUnits {
  /** Mark one surface unit (one or more tokens) as known. */
  learn(unit: string[]): void
  has(unit: string[]): boolean
  /** The first token no known unit covers, or null when the tiling is complete. */
  firstUnknown(tokens: string[]): string | null
  /** Whether every token is covered by known units. */
  covers(tokens: string[]): boolean
}

export function createKnownUnits(): KnownUnits {
  const known = new Set<string>()
  // Longest unit learned so far, so the tiling below never probes wider than
  // anything that could match.
  let maxUnit = 1

  const has = (unit: string[]) => known.has(unit.join(' '))

  const firstUnknown = (tokens: string[]): string | null => {
    let i = 0
    while (i < tokens.length) {
      let matched = 0
      for (let j = Math.min(maxUnit, tokens.length - i); j >= 1; j--) {
        if (known.has(tokens.slice(i, i + j).join(' '))) {
          matched = j
          break
        }
      }
      if (matched === 0) return tokens[i]
      i += matched
    }
    return null
  }

  return {
    learn(unit) {
      known.add(unit.join(' '))
      maxUnit = Math.max(maxUnit, unit.length)
    },
    has,
    firstUnknown,
    covers: (tokens) => firstUnknown(tokens) === null,
  }
}

/** The surface unit(s) that become known once `el` is learned. */
export function unitsFor(el: Element): string[][] {
  return el.provides ?? [tokenize(el.surface)]
}

/** Every token of a card's French, in order. */
export function cardTokens(card: Card): string[] {
  return card.segments.flatMap((s) => tokenize(s.text))
}

/**
 * What the learner has been introduced to, given the cards they have graded.
 *
 * A card introduces its element the first time it is *shown*, and having a
 * scheduler state is what says it was shown — including a suspended one, which
 * the learner saw and then retired. Free agreement forms ride along with their
 * element, as they do everywhere else.
 */
export function knownUnitsFor(cards: Card[], states: Record<string, CardState>): KnownUnits {
  const known = createKnownUnits()
  for (const card of cards) {
    if (!card.element || !states[card.id]) continue
    const el = elementById[card.element]
    if (!el) continue
    for (const unit of el.free ?? []) known.learn(unit)
    for (const unit of unitsFor(el)) known.learn(unit)
  }
  return known
}

/**
 * Is this card pure review for the learner — every word on it already
 * introduced? True for a rest card built from words behind them, and for any
 * card they have seen before (its own element became known on that showing).
 * False on first sight of a card that teaches something.
 *
 * The element it teaches is asked first, because a fixed expression is one unit
 * whose parts can all be old: `ça va` is new the first time it is shown even
 * though `ça` and `va` both arrived long before it, and coverage on its own —
 * which tiles those two words separately — would hand it over as review.
 */
export function isReviewCard(card: Card, known: KnownUnits): boolean {
  const el = card.element ? elementById[card.element] : undefined
  if (el && !unitsFor(el).every((unit) => known.has(unit))) return false
  return known.covers(cardTokens(card))
}
