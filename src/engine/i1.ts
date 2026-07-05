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

  for (const card of cards) {
    const el = elementById[card.element]
    if (!el) {
      violations.push({ cardId: card.id, kind: 'missing-element', detail: card.element })
      continue
    }

    // Tokens the card declares as new (its highlighted segments).
    const newTokens = card.segments.filter((s) => s.highlight).flatMap((s) => tokenize(s.text))

    // Everything else, grouped into contiguous non-highlighted runs.
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

    // Every non-highlighted token must already be known (longest-match tiling).
    for (const tokens of runs) {
      let i = 0
      while (i < tokens.length) {
        let matched = 0
        for (let j = Math.min(maxUnit, tokens.length - i); j >= 1; j--) {
          if (known.has(tokens.slice(i, i + j).join(' '))) {
            matched = j
            break
          }
        }
        if (matched === 0) {
          violations.push({
            cardId: card.id,
            kind: 'not-i1',
            detail: `"${tokens[i]}" is not yet known — only the highlighted element may be new`,
          })
          i += 1
        } else {
          i += matched
        }
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
