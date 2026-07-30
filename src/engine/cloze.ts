import type { Card } from '../types'
import { cardText } from '../types'
import { ELEMENTS, elementById } from '../data/elements'

/**
 * A fill-in-the-blank question built from a card: the sentence with its target
 * word removed, plus four options to put back. `before`/`after` are the text on
 * either side of the gap, so the sentence renders with the blank in place.
 */
export interface ClozeQuestion {
  before: string
  answer: string
  after: string
  /** Four options including `answer`, in a stable shuffled order. */
  choices: string[]
}

export const CHOICE_COUNT = 4

/**
 * Deterministic PRNG seeded from the card id, so a card's options and their
 * order are identical every time it comes up — re-renders don't reshuffle them,
 * and a learner who sees the card again gets the same question.
 */
function seededRandom(seed: string): () => number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * Where the gap goes. Normally it's the card's new element — the one thing the
 * card is teaching, already marked by the highlighted segment(s). A rest card
 * highlights nothing, so we blank its longest word instead: every word on a
 * rest card is known, so any of them is a fair recall target, and the longest
 * is reliably the content word rather than an article or pronoun.
 *
 * Some elements highlight two runs with known text between them — `ne … pas`
 * around its verb, `me dépêche`, or a function word bundled with the first noun
 * it serves (`au marché`, `une voiture`). Only one run can be the gap, so:
 *
 *   1. If a run is exactly the element's surface, that's the one — it's the
 *      whole of what the card teaches (`parce que`, `Ils sont`, `resterais`).
 *   2. Otherwise take the *last* run. The card is heard before it is read, and
 *      the trailing half is the one that survives speech: `pas` carries the
 *      negation while `ne` is dropped outright in everyday French, and `marché`
 *      is audible where `au` reduces to almost nothing. Blanking the leading
 *      function word would ask the learner to hear what isn't reliably said.
 */
function findGap(card: Card): { start: number; end: number } {
  const runs: { start: number; end: number; text: string }[] = []
  let offset = 0
  for (const segment of card.segments) {
    const previous = runs[runs.length - 1]
    // Contiguous highlighted segments are one run; a plain segment breaks it.
    if (segment.highlight && previous?.end === offset) {
      previous.end = offset + segment.text.length
      previous.text += segment.text
    } else if (segment.highlight) {
      runs.push({ start: offset, end: offset + segment.text.length, text: segment.text })
    }
    offset += segment.text.length
  }

  if (runs.length > 0) {
    const surface = card.element ? elementById[card.element]?.surface : undefined
    const exact =
      surface === undefined
        ? undefined
        : runs.find((run) => run.text.trim().toLowerCase() === surface.toLowerCase())
    const { start, end } = exact ?? runs[runs.length - 1]
    return { start, end }
  }

  const text = cardText(card)

  // Spans covered by a fixed multi-word chunk — "est-ce que", "quelque chose",
  // "parce que". These are learned and heard whole, so blanking one word out of
  // the middle asks a question the language never asks; the gap goes elsewhere.
  const chunks: { start: number; end: number }[] = []
  for (const el of ELEMENTS) {
    if (!/[\s]/.test(el.surface)) continue
    const pattern = new RegExp(escapeRegExp(el.surface), 'giu')
    for (const match of text.matchAll(pattern)) {
      chunks.push({ start: match.index, end: match.index + match[0].length })
    }
  }
  const insideChunk = (start: number, end: number) =>
    chunks.some((c) => start < c.end && end > c.start)

  let best = { start: 0, end: 0 }
  for (const match of text.matchAll(/[\p{L}'’-]+/gu)) {
    const start = match.index
    const end = start + match[0].length
    if (insideChunk(start, end)) continue
    if (end - start > best.end - best.start) best = { start, end }
  }
  // Every word belongs to a chunk (a sentence that is nothing but fixed
  // phrases) — fall back to the longest word regardless.
  if (best.end === best.start) {
    for (const match of text.matchAll(/[\p{L}'’-]+/gu)) {
      const start = match.index
      const end = start + match[0].length
      if (end - start > best.end - best.start) best = { start, end }
    }
  }
  return best
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Match a distractor's capitalisation to the answer's, so casing gives nothing away. */
function matchCase(surface: string, answer: string): string {
  const answerIsCapitalised = answer[0] === answer[0]?.toUpperCase()
  if (!answerIsCapitalised) return surface
  return surface.charAt(0).toUpperCase() + surface.slice(1)
}

/**
 * Wrong options are drawn only from elements introduced at or before this card,
 * so every choice is a word the learner has already met — the question tests
 * whether they heard *which* known word it was, never whether they can spot an
 * unfamiliar one. Same-kind (vocab vs grammar) and same-word-count candidates
 * come first so the four options stay comparable; anything else backfills.
 */
function pickDistractors(card: Card, deck: Card[], answer: string, random: () => number): string[] {
  const index = deck.findIndex((c) => c.id === card.id)
  const introduced = new Set(
    deck
      .slice(0, index === -1 ? deck.length : index + 1)
      .map((c) => c.element)
      .filter((id): id is string => Boolean(id)),
  )

  const targetKind = card.element ? elementById[card.element]?.kind : undefined
  const targetWords = answer.trim().split(/\s+/).length
  const seen = new Set([answer.toLowerCase()])

  // A word already sitting in the sentence makes a poor option — the learner can
  // rule it out by looking rather than by listening. Schematic surfaces (the
  // "ne … pas" frame) aren't single fillers, so they're out too.
  const sentence = cardText(card).toLowerCase()
  const usable = ELEMENTS.filter((el) => {
    const key = el.surface.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    if (el.surface.includes('…')) return false
    return !new RegExp(`(^|[^\\p{L}'’])${escapeRegExp(key)}([^\\p{L}'’]|$)`, 'u').test(sentence)
  })

  const rank = (el: (typeof ELEMENTS)[number]) => {
    const kindMatches = targetKind === undefined || el.kind === targetKind
    const lengthMatches = el.surface.trim().split(/\s+/).length === targetWords
    return (kindMatches ? 0 : 2) + (lengthMatches ? 0 : 1)
  }

  // Shuffle first, then sort by rank — ties stay randomised rather than always
  // resolving to whichever element appears first in the inventory.
  const byRank = (pool: typeof ELEMENTS) => shuffle(pool, random).sort((a, b) => rank(a) - rank(b))

  const known = byRank(usable.filter((el) => introduced.has(el.id)))
  // The opening cards have almost nothing behind them, so there aren't three
  // known words to offer yet; backfill from the rest of the inventory.
  const backfill = byRank(usable.filter((el) => !introduced.has(el.id)))

  return [...known, ...backfill]
    .slice(0, CHOICE_COUNT - 1)
    .map((el) => matchCase(el.surface, answer))
}

export function buildCloze(card: Card, deck: Card[]): ClozeQuestion {
  const text = cardText(card)
  const { start, end } = findGap(card)
  const answer = text.slice(start, end)
  const random = seededRandom(card.id)
  const distractors = pickDistractors(card, deck, answer, random)

  return {
    before: text.slice(0, start),
    answer,
    after: text.slice(end),
    choices: shuffle([answer, ...distractors], random),
  }
}
