import type { Card } from '../types'
import { CARDS } from '../data/cards'
import { elementById } from '../data/elements'
import { createKnownUnits, unitsFor } from './known'
import { tokenize } from './tokenize'

export interface Violation {
  cardId: string
  kind: 'missing-element' | 'not-i1' | 'no-new' | 'mismatch' | 'not-new'
  detail: string
}

/**
 * Walk the deck in order and prove every card is i+1: every token outside the
 * highlighted element must already be known, and the highlighted element must
 * introduce something genuinely new. Returns all violations (empty = valid).
 *
 * Known units may be multi-token (e.g. the chunk "un peu"), so coverage is
 * checked by greedy longest-match tiling, not a bag of words.
 */
export function validateDeck(cards: Card[] = CARDS): Violation[] {
  const violations: Violation[] = []
  const known = createKnownUnits()
  const { learn, firstUnknown } = known

  for (const card of cards) {
    const isRest = !card.element
    const el = isRest ? undefined : elementById[card.element as string]
    if (!isRest && !el) {
      violations.push({ cardId: card.id, kind: 'missing-element', detail: card.element ?? '' })
      continue
    }

    // A rest card (rule 3) introduces nothing new. It may still highlight a
    // word for *review* emphasis (e.g. re-flagging `de` to explain the
    // `le temps de` construction), so the whole sentence — highlights included —
    // must already be known.
    if (!el) {
      const unknown = firstUnknown(card.segments.flatMap((s) => tokenize(s.text)))
      if (unknown !== null) {
        violations.push({
          cardId: card.id,
          kind: 'not-i1',
          detail: `"${unknown}" is not yet known — a rest card must be built from known words`,
        })
      }
      continue
    }

    // Tokens the card declares as new (its highlighted segments).
    const newTokens = card.segments.filter((s) => s.highlight).flatMap((s) => tokenize(s.text))

    // Everything else, grouped into contiguous non-highlighted runs; every one
    // must already be known (only the highlighted element may be new).
    const runs: string[][] = []
    let run: string[] = []
    for (const seg of card.segments) {
      if (seg.highlight) {
        if (run.length) runs.push(run)
        run = []
      } else {
        run.push(...tokenize(seg.text))
      }
    }
    if (run.length) runs.push(run)

    // Agreement forms unlocked "for free" by this card (rules.md): they become
    // known here but are not highlighted, so learn them before verifying the
    // non-highlighted remainder — a plural adjective next to a new pronoun then
    // counts as known rather than as an un-highlighted unknown.
    for (const unit of el.free ?? []) learn(unit)

    for (const tokens of runs) {
      const unknown = firstUnknown(tokens)
      if (unknown !== null) {
        violations.push({
          cardId: card.id,
          kind: 'not-i1',
          detail: `"${unknown}" is not yet known — only the highlighted element may be new`,
        })
      }
    }

    const units = unitsFor(el)
    const provideTokens = units.flat()
    const provideSet = new Set(provideTokens)
    const freeSet = new Set((el.free ?? []).flat())
    const highlightedSet = new Set(newTokens)

    // Every token the element provides must be highlighted…
    const missing = provideTokens.filter((t) => !highlightedSet.has(t))
    // …and every highlighted token that isn't part of the element must be a free
    // agreement form or an already-known word shown for review emphasis (e.g. a
    // blue plural-agreement highlight sitting next to the new pronoun+verb).
    const badExtras = newTokens.filter(
      (t) => !provideSet.has(t) && !freeSet.has(t) && !known.has([t]),
    )

    if (newTokens.length === 0) {
      violations.push({ cardId: card.id, kind: 'no-new', detail: 'card highlights no new element' })
    } else if (missing.length || badExtras.length) {
      violations.push({
        cardId: card.id,
        kind: 'mismatch',
        detail:
          `highlighted "${newTokens.slice().sort().join(' ')}" != element "${el.id}" provides "${provideTokens.slice().sort().join(' ')}"` +
          (badExtras.length ? ` (unexpected: ${badExtras.join(', ')})` : ''),
      })
    }

    if (units.every((u) => known.has(u))) {
      violations.push({ cardId: card.id, kind: 'not-new', detail: `element "${el.id}" is already known` })
    }

    for (const unit of units) learn(unit)
  }

  return violations
}
