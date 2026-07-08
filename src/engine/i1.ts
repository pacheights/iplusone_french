import type { Card, Element } from '../types'
import { CARDS } from '../data/cards'
import { elementById } from '../data/elements'
import { tokenize } from './tokenize'

export interface Violation {
  cardId: string
  kind: 'missing-element' | 'not-i1' | 'no-new' | 'mismatch' | 'not-new'
  detail: string
}

/** The surface unit(s) that become known once `el` is learned. */
export function unitsFor(el: Element): string[][] {
  return el.provides ?? [tokenize(el.surface)]
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
  const known = new Set<string>()
  let maxUnit = 1

  const learn = (unit: string[]) => {
    known.add(unit.join(' '))
    maxUnit = Math.max(maxUnit, unit.length)
  }

  // The first token of `tokens` not covered by a known unit (longest-match
  // tiling), or null if every token is known.
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
    const declared = units.flat().slice().sort().join(' ')
    const highlighted = newTokens.slice().sort().join(' ')

    if (newTokens.length === 0) {
      violations.push({ cardId: card.id, kind: 'no-new', detail: 'card highlights no new element' })
    } else if (declared !== highlighted) {
      violations.push({
        cardId: card.id,
        kind: 'mismatch',
        detail: `highlighted "${highlighted}" != element "${el.id}" provides "${declared}"`,
      })
    }

    if (newTokens.length && units.every((u) => known.has(u.join(' ')))) {
      violations.push({ cardId: card.id, kind: 'not-new', detail: `element "${el.id}" is already known` })
    }

    for (const unit of units) learn(unit)
  }

  return violations
}
