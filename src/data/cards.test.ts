import { describe, expect, test } from 'vitest'
import { CARDS } from './cards'
import { ELEMENTS } from './elements'
import { buildFillBlank } from '../engine/fillBlank'
import { cardText } from '../types'

/**
 * The one card whose blanked word has no English word to point at: `Est-ce que`
 * turns a statement into a question by being there, where English asks by
 * inverting instead, so its translation stays plain.
 */
const NO_ENGLISH_COUNTERPART = new Set(['c13'])

/** The contiguous highlighted run of a translation, as one string. */
function gloss(segments: { text: string; highlight?: string }[]): string {
  return segments
    .filter((s) => s.highlight)
    .map((s) => s.text)
    .join('')
}

describe('the deck', () => {
  // What the answer bolds is the gloss of the word just filled in — which only
  // holds if every card marks one.
  test('every card names the English counterpart of its blank', () => {
    const unmarked = CARDS.filter((c) => gloss(c.translation) === '').map((c) => c.id)
    expect(unmarked).toEqual([...NO_ENGLISH_COUNTERPART])
  })

  // The gloss is one thing the learner reads in one go; scattered bold runs on
  // either side of plain text would read as two.
  test('the counterpart is one contiguous run', () => {
    for (const card of CARDS) {
      const highlighted = card.translation.map((s) => Boolean(s.highlight))
      const first = highlighted.indexOf(true)
      const last = highlighted.lastIndexOf(true)
      if (first === -1) continue
      expect(highlighted.slice(first, last + 1), `${card.id} bolds two runs`).not.toContain(false)
    }
  })

  /**
   * The bold is written by hand and the gap on a rest card is chosen by the
   * engine, so a change to the heuristic can silently walk the gap off the word
   * the English points at. Nothing can check a translation for meaning, but the
   * element that taught the blanked word already carries an English gloss —
   * so the bold sharing a word with that gloss catches the gap having moved.
   */
  test('the bold points at the word the gap takes out', () => {
    // Where the two disagree on the page and are still right underneath.
    const KNOWN_GOOD: Record<string, string> = {
      c53: 'the gloss is the il/elle form; the subject here is on, so English says "have"',
      c68: 'the gloss is the il/elle form; the subject here is on, so English says "have"',
      c62: 'avoir faim is "to be hungry", so as answers to English "are"',
      c59: 'the gloss belongs to the bundled "mon ami"',
      c282: 'the gloss belongs to the bundled "mon ami"; the plural stands alone here',
      c373: 'the gloss belongs to the bundled "mon ami"; the plural stands alone here',
      c260: 'French makes the weather with faire, so fait answers to English "is"',
      c265: 'avoir froid is "to be cold", so avez answers to English "are"',
    }

    const glosses = new Map<string, string>()
    for (const el of ELEMENTS) {
      for (const unit of [[el.surface], ...(el.provides ?? []), ...(el.free ?? [])]) {
        const key = unit.join(' ').toLowerCase()
        if (!glosses.has(key)) glosses.set(key, el.gloss.toLowerCase())
      }
    }

    for (const card of CARDS) {
      const bold = gloss(card.translation)
      const english = glosses.get(buildFillBlank(card, CARDS).answer.toLowerCase())
      if (!bold || english === undefined || card.id in KNOWN_GOOD) continue
      const shared = bold
        .toLowerCase()
        .split(/[^a-z']+/)
        .filter(Boolean)
        .some((word) => english.includes(word))
      expect(shared, `${card.id} bolds "${bold}" but its blank means "${english}"`).toBe(true)
    }
  })

  test('a card that names its blank gets exactly that word', () => {
    for (const card of CARDS) {
      if (!card.blank) continue
      expect(cardText(card), card.id).toContain(card.blank)
      expect(buildFillBlank(card, CARDS).answer, card.id).toBe(card.blank)
    }
  })
})
