import { describe, expect, it } from 'vitest'
import { LISTENING_ITEMS } from '../data/listening'
import { CARDS } from '../data/cards'
import { elementById } from '../data/elements'
import type { ListeningChoice } from '../types'

/**
 * Guards the hand-written listening bank. The two ways an item can be wrong:
 *   1. it uses a word the learner hasn't been taught (breaks the "known words
 *      only" rule), or
 *   2. its `requires` omits an element whose word it uses (so it appears before
 *      that word is learned).
 * Both reduce to the same check: every word in every choice must be covered by
 * the union of surface forms provided by the item's declared `requires`.
 */

/** Every element id actually taught somewhere in the deck. */
const TAUGHT = new Set(CARDS.map((c) => c.element).filter((e): e is string => !!e))

/** Every word form an element makes known (its surface, or its `provides` units). */
function wordsOf(elementId: string): string[] {
  const el = elementById[elementId]
  if (!el) return []
  const units = el.provides ?? [el.surface.split(' ')]
  return units.flatMap((unit) => unit.flatMap((w) => splitWord(w)))
}

/** Break a surface/word into bare word tokens (split hyphens, keep aujourd'hui whole). */
function splitWord(w: string): string[] {
  return w.toLowerCase().split('-').filter(Boolean)
}

const ELISION_PREFIXES: Record<string, string> = {
  j: 'je',
  n: 'ne',
  l: 'le', // l' is le/la before a vowel — either 'le' or 'la' in requires covers it
  d: 'de',
  qu: 'que',
  c: 'ce',
  s: 'se',
  m: 'me',
  t: 'te',
}

/**
 * Tokenize a spoken sentence into the words that must be known. Elided forms
 * (j', n', l', d', …) are split: the prefix maps to a function word that must
 * also be covered, and the remainder is a content word to check.
 */
function tokensToCheck(sentence: string): string[] {
  const raw = sentence
    .toLowerCase()
    .replace(/[?.,!]/g, ' ')
    .split(/[\s-]+/)
    .filter(Boolean)

  const out: string[] = []
  for (const token of raw) {
    const apos = token.indexOf("'")
    if (apos === -1) {
      out.push(token)
      continue
    }
    const prefix = token.slice(0, apos)
    const base = ELISION_PREFIXES[prefix]
    if (base) {
      out.push(base)
      const rest = token.slice(apos + 1)
      if (rest) out.push(rest)
    } else {
      // apostrophe that isn't an elision, e.g. aujourd'hui — keep whole
      out.push(token)
    }
  }
  return out
}

function allowedWords(requires: string[]): Set<string> {
  const set = new Set<string>()
  for (const id of requires) {
    for (const w of wordsOf(id)) {
      // Agreement endings are free once the base word is known (rules.md #1):
      // accept the plural (-s) and feminine (-e / -es) forms of any known word.
      set.add(w)
      set.add(`${w}s`)
      set.add(`${w}e`)
      set.add(`${w}es`)
    }
  }
  // l' before a vowel is written 'le' by tokensToCheck; if the item only has a
  // feminine article (la), accept 'le' as its elided stand-in and vice versa.
  if (set.has('la')) set.add('le')
  if (set.has('le')) set.add('la')
  return set
}

const choices = (): { itemId: string; choice: ListeningChoice }[] =>
  LISTENING_ITEMS.flatMap((item) =>
    [item.answer, ...item.distractors].map((choice) => ({ itemId: item.id, choice })),
  )

describe('listening bank', () => {
  it('has unique item ids', () => {
    const ids = LISTENING_ITEMS.map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('only requires elements that are actually taught in the deck', () => {
    const problems: string[] = []
    for (const item of LISTENING_ITEMS) {
      for (const id of item.requires) {
        if (!elementById[id]) problems.push(`${item.id}: unknown element "${id}"`)
        else if (!TAUGHT.has(id)) problems.push(`${item.id}: "${id}" is never taught by a card`)
      }
    }
    expect(problems, problems.join('\n')).toEqual([])
  })

  it('every word in every choice is covered by the item\'s requires', () => {
    const problems: string[] = []
    for (const item of LISTENING_ITEMS) {
      const allowed = allowedWords(item.requires)
      for (const choice of [item.answer, ...item.distractors]) {
        for (const word of tokensToCheck(choice.text)) {
          if (!allowed.has(word)) {
            problems.push(`${item.id}: "${choice.text}" → "${word}" not in [${item.requires.join(', ')}]`)
          }
        }
      }
    }
    expect(problems, `\n${problems.join('\n')}`).toEqual([])
  })

  it('every choice has a non-empty French text and English translation', () => {
    for (const { itemId, choice } of choices()) {
      expect(choice.text.trim(), itemId).not.toBe('')
      expect(choice.translation.trim(), itemId).not.toBe('')
    }
  })
})
