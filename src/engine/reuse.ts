import type { Card, Element } from '../types'
import { CARDS } from '../data/cards'
import { ELEMENTS } from '../data/elements'
import { tokenize } from './tokenize'

/**
 * Reuse enforcement — the machinery behind "bring old words back" (md/rules.md
 * rule 4).
 *
 * Rule 4 asks the writer to fill an open slot with a word taught long ago, and
 * to reach further as the deck grows. Left as an intention it inverts: across
 * blocks 1–5 the share of elements that ever reappear in a *later* block fell
 * 83% → 55% → 47% → 33%. The capacity was never the problem — each block
 * already touches ~40% of the inventory — but it reaches for the same handful
 * of scaffolding words (je, est-ce que, ne … pas, ici, on, c'est …) while the
 * other half goes permanently dark.
 *
 * What the SRS can and cannot fix draws the line here. FSRS schedules *cards*,
 * not words, so a word living in one card rides that card's interval out to
 * months — and the blank never moves, so the learner memorises one sentence.
 * That is fine where the whole skill is recall (content, libre, boire): let the
 * scheduler have them. It is not fine where the skill is *choice*, because a
 * choice can only be exercised against alternatives and one card offers none.
 *
 * So only the assemble-class is enforced here, and it is deliberately narrow:
 *
 *   - **verb person-forms** — the entire skill is picking `ont` over `sont`
 *     over `a`; recognising `ont` is worth nothing. The nous/vous/ils forms are
 *     the consistent casualties, alive only inside their own paradigm drill.
 *   - **articles** — `des` / `du` / `de` is a choice made on every noun. `des`
 *     last appeared on card 59 and the partitive once in the last 70 cards.
 *   - **connectors** — `et`, `ou`, `mais` exist only to join *new* material, so
 *     a connector inside a frozen sentence is not functioning as one.
 *
 * Open-class vocabulary never trips these checks. That is what keeps the rule
 * affordable: the assemble-class is bounded and grows slowly, while putting all
 * vocabulary on a clock would make the deck unwritable by block 12.
 */

export interface Block {
  n: number
  verb: string
  /** 1-based index of the block's first card in deck order. */
  start: number
}

/**
 * Where each block begins. A block runs to the card before the next block's
 * start, so adding a block means adding one number — lengths stay free to move
 * without invalidating everything downstream.
 */
export const BLOCKS: Block[] = [
  { n: 1, verb: 'être', start: 1 },
  { n: 2, verb: 'avoir', start: 44 },
  { n: 3, verb: 'vouloir', start: 77 },
  { n: 4, verb: 'pouvoir', start: 116 },
  { n: 5, verb: 'devoir', start: 151 },
  { n: 6, verb: 'aller', start: 186 },
  { n: 7, verb: 'faire', start: 232 },
  { n: 8, verb: 'parler', start: 272 },
  { n: 9, verb: 'more -er', start: 311 },
  { n: 10, verb: 'stem-changing -er', start: 351 },
  { n: 11, verb: '-ir verbs', start: 376 },
]

/**
 * Blocks 1–5 are grandfathered: they were written before these quotas existed
 * and the deck is not rewritten backwards. Enforcement starts with block 6.
 */
export const ENFORCED_FROM = 6

/** How many earlier verbs a block must re-conjugate at a plural person. */
const PLURAL_VERB_QUOTA = 2

const CONNECTORS = ['et', 'ou', 'mais'] as const

/**
 * Blocks 1–10 predate the subject check and are not rewritten backwards; the
 * floor applies from block 11 on.
 */
export const SUBJECTS_FROM = 11

/** Share of a block's cards whose subject is not a person. */
const NON_PERSON_SHARE = 0.25

/** How many of those must be a plain noun rather than c'est / il y a / il faut. */
const NOUN_SUBJECT_QUOTA = 4

/** Persons whose forms die at their block boundary unless a quota holds them. */
const PLURAL_PERSONS = new Set(['nous', 'vous', 'ils', 'elles'])

/**
 * A conjugated form is glossed "… (infinitive — person form)" — e.g.
 * "have (avoir — ils/elles form)". The `je voudrais` element is glossed
 * "(vouloir — the polite form)", which parses here but names no person, so it
 * never satisfies the plural quota.
 */
const FORM_GLOSS = /\(([^\s()]+) — ([a-zà-öø-ÿ/]+) form\)/

/**
 * From block 8 a regular -er verb is one element carrying all six forms
 * (md/rules.md, "The -er endings"), glossed "(parler — all six forms)". It goes
 * on the clock like any other verb: the endings are free, but the *persons*
 * still go dark, which is exactly what these quotas exist to catch.
 */
const ALL_FORMS_GLOSS = /\(([^\s()]+) — all six forms\)/

/** The endings that mark a plural person on a regular -er verb. */
const PLURAL_ENDINGS = ['ons', 'ez', 'ent']

interface VerbForm {
  verb: string
  persons: string[]
}

function verbForm(el: Element): VerbForm | null {
  const m = FORM_GLOSS.exec(el.gloss)
  if (m) return { verb: m[1], persons: m[2].split('/') }
  const all = ALL_FORMS_GLOSS.exec(el.gloss)
  if (all) return { verb: all[1], persons: ['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils'] }
  return null
}

/** True for the one-element-per-verb kind, whose forms live in `free`. */
function isBundled(el: Element): boolean {
  return ALL_FORMS_GLOSS.test(el.gloss)
}

/**
 * The shapes that count as this verb appearing *at a plural person*.
 *
 * A per-form element is the form itself. A bundled one has to be read from its
 * endings, since all six spellings sit in `free` together — and only the plural
 * three satisfy the quota, or a block could meet it with `je parle`.
 */
function pluralProbes(el: Element): string[][] {
  if (!isBundled(el)) return probes(el)
  return [[el.surface], ...(el.free ?? []).map((u) => u)].filter((u) =>
    PLURAL_ENDINGS.some((end) => u[u.length - 1].endsWith(end)),
  )
}

/**
 * Every shape that counts as this element appearing in a sentence.
 *
 * For a conjugated form it is the verb form alone — `nous sommes` registers on
 * `sommes`, so the element still counts when the pronoun is displaced or the
 * verb is wrapped in `ne … pas`, and never counts merely because `nous` turned
 * up somewhere.
 *
 * For everything else it is each unit the element makes known plus the free
 * agreement forms it unlocks, since `malades` on card 162 is `malade` staying
 * alive and `un bus` is `le bus` staying alive.
 */
function probes(el: Element): string[][] {
  const tokens = tokenize(el.surface)
  if (isBundled(el)) return [tokens.slice(-1), ...(el.free ?? [])]
  if (verbForm(el)) return [tokens.slice(-1)]
  const shapes = [tokens, ...(el.provides ?? []), ...(el.free ?? [])]
  return shapes.filter((s) => s.length > 0)
}

/** Do `needle`'s tokens appear in `tokens` in order? Gaps allowed, so a form
 *  wrapped in `ne … pas` still counts as an appearance. */
function containsInOrder(tokens: string[], needle: string[]): boolean {
  let i = 0
  for (const t of tokens) {
    if (t === needle[i]) i++
    if (i === needle.length) return true
  }
  return needle.length === 0
}

function hasBigram(tokens: string[], a: string, b: string): boolean {
  return tokens.some((t, i) => t === a && tokens[i + 1] === b)
}

/**
 * Who or what is doing the verb, per card.
 *
 * Left to itself the deck drifts to people: 82% of the first 375 cards open on
 * a subject pronoun, and the non-person share fell 34% → 13% → 5% → 0% across
 * blocks 5–10. Some of that is structural — a paradigm block runs nine pronouns
 * past one held-still object — but the free slots went the same way, so the
 * learner meets `le bus est en retard` nine times in a deck of hundreds and
 * never builds the habit of putting a thing in front of a verb.
 *
 * This is a heuristic, not a parse: it strips whatever opens the sentence and
 * reads what is left. It exists to catch drift across forty cards, where being
 * wrong about one of them changes nothing.
 */
export type Subject = 'person' | 'impersonal' | 'noun'

const PERSON_PRONOUNS = new Set(['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'on'])

/** Words that can stand in front of the subject without being one. */
const OPENERS = [
  ['que', 'est', 'ce', 'que'],
  ['est', 'ce', 'que'],
  ['pourquoi'],
  ['comment'],
  ['où'],
  ['oui'],
  ['non'],
  ['merci'],
  ['peut', 'être'],
  ['mais'],
  ['et'],
  ['ou'],
  ['si', 'le', 'vous', 'plaît'],
  ['accord'],
  ['de'],
]

/** Weather sits on `il fait` and is nobody's doing. */
const WEATHER = new Set(['chaud', 'froid', 'beau', 'mauvais'])

export function subjectOf(card: Card): Subject {
  let tk = card.segments.flatMap((s) => tokenize(s.text))
  for (let guard = 0; guard < 8; guard++) {
    if (tk[0] === 'quel' && tk[1] === 'temps') return 'impersonal'
    if (tk[0] === 'il' && tk[1] === 'y' && tk[2] === 'a') return 'impersonal'
    if (tk[0] === 'il' && (tk[1] === 'faut' || tk[2] === 'faut')) return 'impersonal'
    if (tk[0] === 'il' && tk[1] === 'fait' && WEATHER.has(tk[2] ?? '')) return 'impersonal'
    if (tk[0] === 'il' && tk[1] === 'ne' && tk[2] === 'fait' && WEATHER.has(tk[4] ?? '')) return 'impersonal'
    if (tk[0] === 'ce' && (tk[1] === 'est' || tk[1] === 'ne')) return 'impersonal'
    if (tk[0] === 'ça') return 'impersonal'
    if (PERSON_PRONOUNS.has(tk[0] ?? '')) return 'person'
    // An inverted question puts the verb first: comment allez-vous, pouvez-vous.
    if (PERSON_PRONOUNS.has(tk[1] ?? '')) return 'person'
    const opener = OPENERS.find((o) => o.every((w, i) => tk[i] === w))
    if (!opener) break
    tk = tk.slice(opener.length)
  }
  return 'noun'
}

export interface BlockCards {
  block: Block
  /** 1-based deck indices of the cards in this block. */
  indices: number[]
  cards: Card[]
}

/** Split the deck into blocks. Blocks with no cards written yet are omitted. */
export function blocksOf(cards: Card[] = CARDS): BlockCards[] {
  return BLOCKS.map((block, i) => {
    const end = BLOCKS[i + 1] ? BLOCKS[i + 1].start - 1 : cards.length
    const indices: number[] = []
    for (let n = block.start; n <= Math.min(end, cards.length); n++) indices.push(n)
    return { block, indices, cards: indices.map((n) => cards[n - 1]) }
  }).filter((b) => b.cards.length > 0)
}

export interface ReuseViolation {
  block: number
  kind: 'plural-verbs' | 'articles' | 'connectors' | 'subjects'
  detail: string
}

/**
 * Check every enforced block against the three reuse quotas. Returns all
 * violations (empty = the deck keeps its old choices alive).
 */
export function checkReuse(cards: Card[] = CARDS): ReuseViolation[] {
  const violations: ReuseViolation[] = []

  // Which block each element is introduced in, by first card that teaches it.
  const introBlock = new Map<string, number>()
  for (const { block, cards: blockCards } of blocksOf(cards)) {
    for (const card of blockCards) {
      if (card.element && !introBlock.has(card.element)) introBlock.set(card.element, block.n)
    }
  }

  const pluralForms = ELEMENTS.map((el) => ({ el, form: verbForm(el) })).filter(
    (e): e is { el: Element; form: VerbForm } =>
      e.form !== null && e.form.persons.some((p) => PLURAL_PERSONS.has(p)),
  )

  for (const { block, cards: blockCards } of blocksOf(cards)) {
    if (block.n < ENFORCED_FROM) continue

    const perCard = blockCards.map((c) => c.segments.flatMap((s) => tokenize(s.text)))
    const all = perCard.flat()

    // 1. Plural person-forms of verbs taught in an *earlier* block.
    const revived = new Set<string>()
    for (const { el, form } of pluralForms) {
      const intro = introBlock.get(el.id)
      if (intro === undefined || intro >= block.n) continue
      const appears = perCard.some((tokens) =>
        pluralProbes(el).some((needle) => containsInOrder(tokens, needle)),
      )
      if (appears) revived.add(form.verb)
    }
    if (revived.size < PLURAL_VERB_QUOTA) {
      violations.push({
        block: block.n,
        kind: 'plural-verbs',
        detail:
          `re-conjugates ${revived.size} earlier verb${revived.size === 1 ? '' : 's'} ` +
          `at nous/vous/ils (${[...revived].join(', ') || 'none'}); ` +
          `rule 4 asks for ${PLURAL_VERB_QUOTA}`,
      })
    }

    // 2. The article system, which goes dark fastest of anything in the deck.
    //    `d'` and `l'` both tokenize to their full forms, so "de l'eau" is
    //    ['de','le','eau'] and "pas d'eau" is ['pas','de','eau'].
    const missingArticles: string[] = []
    if (!all.includes('des')) missingArticles.push('des')
    if (!all.includes('du') && !hasBigram(all, 'de', 'la') && !hasBigram(all, 'de', 'le'))
      missingArticles.push('a partitive (du / de la / de l\')')
    if (!hasBigram(all, 'pas', 'de')) missingArticles.push('de under ne … pas')
    if (missingArticles.length) {
      violations.push({
        block: block.n,
        kind: 'articles',
        detail: `never uses ${missingArticles.join(', ')}`,
      })
    }

    // 3. Connectors only function when they join something new.
    const missingConnectors = CONNECTORS.filter((c) => !all.includes(c))
    if (missingConnectors.length) {
      violations.push({
        block: block.n,
        kind: 'connectors',
        detail: `never uses ${missingConnectors.join(', ')}`,
      })
    }

    // 4. Who is doing the verb. A deck of pronouns teaches conjugation and
    //    nothing about putting a thing in front of a verb.
    if (block.n >= SUBJECTS_FROM) {
      const subjects = blockCards.map(subjectOf)
      const nonPerson = subjects.filter((s) => s !== 'person').length
      const nouns = subjects.filter((s) => s === 'noun').length
      const floor = Math.ceil(blockCards.length * NON_PERSON_SHARE)
      const short: string[] = []
      if (nonPerson < floor) short.push(`${nonPerson} of ${blockCards.length} cards have a subject that is not a person; rule asks ${floor}`)
      if (nouns < NOUN_SUBJECT_QUOTA) short.push(`only ${nouns} open on a plain noun; rule asks ${NOUN_SUBJECT_QUOTA}`)
      if (short.length) violations.push({ block: block.n, kind: 'subjects', detail: short.join('; ') })
    }
  }

  return violations
}

export interface StaleElement {
  id: string
  surface: string
  gloss: string
  /** Deck index of the last card it appears on — its own card if never reused. */
  lastSeen: number
  /** Blocks written since that card, so 0 means "used in the current block". */
  blocksSilent: number
  /**
   * On the reuse clock — either marked `clock` in the inventory or recognised
   * as a conjugated form. These are the assemble-class: the deck owes them an
   * appearance, where a retrieve-class word can be left to the scheduler.
   */
  clocked: boolean
}

/**
 * The staleness ledger: every element ordered by how long it has been silent.
 * This is the diagnostic the quotas are enforced against — call it before
 * writing a block to see which old choices are owed an appearance, then fill
 * that block's open slots with the ones at the top.
 *
 * Reports the whole inventory, not just the assemble-class: an open-class word
 * near the top is not a violation (the SRS owns recall), but it is still the
 * first thing to reach for when a slot needs filling.
 */
export function stalenessReport(cards: Card[] = CARDS): StaleElement[] {
  const blocks = blocksOf(cards)
  const blockOfCard = (n: number) =>
    blocks.filter((b) => b.block.start <= n).at(-1)?.block.n ?? 1
  const latestBlock = blocks.at(-1)?.block.n ?? 1

  const perCard = cards.map((c) => c.segments.flatMap((s) => tokenize(s.text)))

  const report: StaleElement[] = []
  for (const el of ELEMENTS) {
    const needles = probes(el)
    let lastSeen = 0
    for (let i = perCard.length - 1; i >= 0; i--) {
      if (needles.some((needle) => containsInOrder(perCard[i], needle))) {
        lastSeen = i + 1
        break
      }
    }
    if (lastSeen === 0) continue
    report.push({
      id: el.id,
      surface: el.surface,
      gloss: el.gloss,
      lastSeen,
      blocksSilent: latestBlock - blockOfCard(lastSeen),
      clocked: el.clock === true || verbForm(el) !== null,
    })
  }

  return report.sort((a, b) => a.lastSeen - b.lastSeen)
}
