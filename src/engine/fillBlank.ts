import type { Card, ElementKind } from '../types'
import { cardText } from '../types'
import { ELEMENTS, elementById } from '../data/elements'

/**
 * A fill-in-the-blank question built from a card: the sentence with its target
 * word removed, plus four options to put back. `before`/`after` are the text on
 * either side of the gap, so the sentence renders with the blank in place.
 */
export interface FillBlankQuestion {
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
 * Where the gap goes. A card that names its own `blank` gets that word; failing
 * that it's the card's new element — the one thing the card is teaching,
 * already marked by the highlighted segment(s). A rest card names no element
 * and highlights nothing, so it falls to `restGap` below, which ranks the words
 * of the sentence and rotates away from what was just answered.
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
function findGap(card: Card, recentAnswers: string[]): { start: number; end: number } {
  const text = cardText(card)

  // A named blank wins outright — it is the deck saying where the gap goes, and
  // the card's translation bolds the English counterpart of that exact word.
  // Matched on letter boundaries at both ends, so "ami" isn't found inside
  // "amis" and "est" isn't found inside "est-ce".
  if (card.blank) {
    const edge = "[^\\p{L}'’-]"
    const found = new RegExp(`(^|${edge})(${escapeRegExp(card.blank)})(?=${edge}|$)`, 'u').exec(text)
    if (found) {
      const start = found.index + found[1].length
      return { start, end: start + card.blank.length }
    }
  }

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

  return restGap(text, recentAnswers, seededRandom(card.id))
}

/**
 * Every unit a learner can be asked to produce, and where it was introduced.
 *
 * Keyed by the unit's own text, so a card can be asked for `es` on its own even
 * though it arrives bundled as `tu es` — `provides` is exactly the deck saying
 * which halves stand alone. The bundled surface is askable too (blanking
 * `tu es` whole is a fair question), and so are the free agreement forms, which
 * appear in sentences without ever being anyone's surface.
 *
 * `order` is the element's position in the inventory, i.e. how recently it was
 * taught — the ranking below reads it as "how close this word is to what the
 * learner is working on right now".
 */
const knownUnits = new Map<string, { kind: ElementKind; order: number }>()
ELEMENTS.forEach((el, order) => {
  const units = [...(el.provides ?? [[el.surface]]), ...(el.free ?? []), [el.surface]]
  for (const unit of units) {
    const key = unit.join(' ').toLowerCase()
    // A schematic surface (the "ne … pas" frame) is not a fillable unit.
    if (key.includes('…')) continue
    // First writer wins, so a unit keeps the order of the card that taught it
    // rather than of some later card that happens to reuse it.
    if (!knownUnits.has(key)) knownUnits.set(key, { kind: el.kind, order })
  }
})

const MAX_UNIT_WORDS = Math.max(...[...knownUnits.keys()].map((k) => k.split(' ').length))

/**
 * The spans of a sentence that could each be a gap.
 *
 * One per word, except that a known multi-word unit — `est-ce que`, `quelque
 * chose`, `un peu` — is one span rather than several. Those are learned and
 * heard whole, so the choice is to blank all of it or none of it; blanking one
 * word out of the middle asks a question the language never asks.
 */
function candidateSpans(text: string): { start: number; end: number; text: string }[] {
  const words = [...text.matchAll(/[\p{L}'’-]+/gu)].map((m) => ({
    start: m.index,
    end: m.index + m[0].length,
  }))
  const spans: { start: number; end: number; text: string }[] = []
  for (let i = 0; i < words.length; i++) {
    let { start } = words[i]
    // An elided word arrives fused to the one before it — d'eau, l'ami, qu'il.
    // The gap takes the word, not the fusion: "il n'y a pas d'[eau]" asks for a
    // unit the learner has actually been taught, where "[d'eau]" asks for a form
    // that exists nowhere in the inventory and, being the only option with an
    // apostrophe, announces itself among three clean distractors. A unit can
    // begin at the fused word too — "est-ce qu'[il y a] un problème" — so both
    // starts are tried, longest unit first.
    const fused = /['’]/.exec(text.slice(start, words[i].end))
    const bare = fused ? start + fused.index + 1 : start

    let width = 1
    for (let n = Math.min(MAX_UNIT_WORDS, words.length - i); n > 1; n--) {
      const stop = words[i + n - 1].end
      if (knownUnits.has(text.slice(start, stop).toLowerCase())) {
        width = n
        break
      }
      if (bare !== start && knownUnits.has(text.slice(bare, stop).toLowerCase())) {
        width = n
        start = bare
        break
      }
    }
    const { end } = words[i + width - 1]
    if (start !== bare && knownUnits.has(text.slice(bare, end).toLowerCase())) start = bare
    spans.push({ start, end, text: text.slice(start, end) })
    i += width - 1
  }
  return spans
}

/** How many preceding cards' answers a rest card refuses to repeat. */
export const REPEAT_WINDOW = 3

/**
 * What kind of gap a span would make, best first.
 *
 * Vocabulary outranks grammar because a rest card is drilling words: asking for
 * `voiture` or `veux` is a question about the sentence, where asking for the
 * `une` in front of it is a question about the blank. Grammar words are still
 * fair game — they just wait until the rotation has used up the vocabulary.
 *
 * A span that is no unit at all comes last: it is a form the deck never taught,
 * so there is nothing to recall and no matching distractor to hide it among.
 */
function tier(unit: { kind: ElementKind } | undefined): number {
  if (unit === undefined) return 2
  return unit.kind === 'vocab' ? 0 : 1
}

/**
 * Where the gap goes on a rest card that names no blank.
 *
 * A rest card highlights nothing, so nothing on it declares itself the target.
 * Two things decide instead:
 *
 *   1. **What the card is closest to teaching.** Candidates are ranked by how
 *      recently their unit entered the inventory, so the gap lands on the newest
 *      thing in the sentence — the word the card is drilling — rather than on
 *      whichever word happens to be longest. Length only breaks ties.
 *   2. **What the learner has just answered.** A run of rest cards that varies
 *      the verb around a fixed noun (`Elle a une voiture`, `Elles ont une
 *      voiture`, `On a une voiture`) would otherwise blank that same noun every
 *      time, drilling the one word that never changes and never once asking for
 *      the conjugation the run exists to teach. So any answer given in the last
 *      `REPEAT_WINDOW` cards is off the table, and the gap moves down the
 *      ranking to the next-best word — which is exactly the part that varies.
 *
 * Elision fragments (`n'y`, `qu'il`, `d'eau`) rank below everything: they are
 * not units anyone can be asked for, and as options they are shape-unique
 * against three clean distractors, which gives the answer away.
 *
 * If the window rules out every candidate, it is relaxed one card at a time —
 * a short sentence of already-used words still has to produce a gap.
 */
function restGap(
  text: string,
  recentAnswers: string[],
  random: () => number,
): { start: number; end: number } {
  const spans = candidateSpans(text)
  if (spans.length === 0) return { start: 0, end: text.length }

  const ranked = shuffle(spans, random).sort((a, b) => {
    const unitA = knownUnits.get(a.text.toLowerCase())
    const unitB = knownUnits.get(b.text.toLowerCase())
    const tierDiff = tier(unitA) - tier(unitB)
    if (tierDiff !== 0) return tierDiff
    const orderDiff = (unitB?.order ?? -1) - (unitA?.order ?? -1)
    if (orderDiff !== 0) return orderDiff
    return b.text.length - a.text.length
  })

  for (let window = Math.min(REPEAT_WINDOW, recentAnswers.length); window >= 0; window--) {
    const blocked = new Set(recentAnswers.slice(recentAnswers.length - window))
    const pick = ranked.find((span) => !blocked.has(span.text.toLowerCase()))
    if (pick) return { start: pick.start, end: pick.end }
  }
  return { start: ranked[0].start, end: ranked[0].end }
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
 * The other forms of the answer's own verb, drawn from the whole inventory.
 *
 * These are the sharpest wrong options a conjugation card can offer: the
 * question such a card exists to ask is *which person*, and that can only be
 * asked against the other persons. Two reasons the generic pool cannot supply
 * them — a regular -er verb keeps all six forms in `free` (md/rules.md, "The
 * -er endings"), so five of them are not element surfaces at all; and where
 * they are surfaces, they sit among hundreds of equally-ranked words and are
 * picked only by luck.
 *
 * A verb is recognised from its gloss, the same shape reuse.ts reads.
 */
const VERB_GLOSS = /\(([^\s()]+) — (?:[a-zà-öø-ÿ/]+ form|all six forms|the polite form)\)/

function formsOf(el: (typeof ELEMENTS)[number]): string[] {
  return [[el.surface], ...(el.free ?? [])].map((u) => u.join(' '))
}

function siblingForms(answer: string): string[] {
  const key = answer.trim().toLowerCase()
  const owner = ELEMENTS.find(
    (el) => VERB_GLOSS.test(el.gloss) && formsOf(el).some((f) => f.toLowerCase() === key),
  )
  if (!owner) return []
  const verb = VERB_GLOSS.exec(owner.gloss)?.[1]
  const forms = new Set<string>()
  for (const el of ELEMENTS) {
    if (VERB_GLOSS.exec(el.gloss)?.[1] !== verb) continue
    for (const form of formsOf(el)) forms.add(form)
  }
  const siblings = [...forms].filter((form) => form.toLowerCase() !== key)

  // One element can carry more than one verb — the card that switches the -er
  // endings on for every infinitive already known holds six of them at once.
  // Keep only the forms built on the same stem, or the options would ask which
  // verb rather than which person.
  const stem = key.slice(0, 3)
  const sameStem = siblings.filter((form) => form.toLowerCase().startsWith(stem))
  return sameStem.length >= 3 ? sameStem : siblings
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

  // Sibling forms go first: they are the sharpest wrong answers a conjugation
  // card can offer, and nothing else in the pool carries them.
  const siblings = shuffle(siblingForms(answer), random).filter(
    (form) => !new RegExp(`(^|[^\\p{L}'’])${escapeRegExp(form.toLowerCase())}([^\\p{L}'’]|$)`, 'u').test(sentence),
  )

  // A sibling form can also be some element's surface, so dedupe on the way out.
  const chosen: string[] = []
  for (const form of [...siblings, ...[...known, ...backfill].map((el) => el.surface)]) {
    if (chosen.length === CHOICE_COUNT - 1) break
    if (!chosen.some((c) => c.toLowerCase() === form.toLowerCase())) chosen.push(form)
  }
  return chosen.map((surface) => matchCase(surface, answer))
}

/**
 * Every card's gap, resolved in deck order.
 *
 * A rest card's gap depends on what the cards before it answered, so the deck
 * has to be walked front to back once rather than each card solved alone. The
 * result is cached per deck array, so this stays a one-off: `buildFillBlank` is
 * called on every render, and must give the same answer every time.
 *
 * The lookback doesn't cost determinism — a card's position in the deck is
 * fixed, so its gap is too. It depends on the deck, never on the learner's own
 * history, which is what keeps a card identical on its 1st and 50th showing.
 */
const deckGaps = new WeakMap<Card[], Map<string, { start: number; end: number }>>()

function gapFor(card: Card, deck: Card[]): { start: number; end: number } {
  let gaps = deckGaps.get(deck)
  if (!gaps) {
    gaps = new Map()
    const recent: string[] = []
    for (const other of deck) {
      const gap = findGap(other, recent)
      gaps.set(other.id, gap)
      recent.push(cardText(other).slice(gap.start, gap.end).toLowerCase())
    }
    deckGaps.set(deck, gaps)
  }
  // A card built outside the deck (a preview, a test) has nothing before it.
  return gaps.get(card.id) ?? findGap(card, [])
}

export function buildFillBlank(card: Card, deck: Card[]): FillBlankQuestion {
  const text = cardText(card)
  const { start, end } = gapFor(card, deck)
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
