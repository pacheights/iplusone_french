import { phoneticForm } from './engine/phonetic'
import { spokenForm } from './engine/speech'

export type ElementKind = 'vocab' | 'grammar'

export interface Segment {
  text: string
  highlight?: ElementKind
  /**
   * Set on a translation segment English would not bother to say, carried only
   * because French has no way to leave it out — the "some" that glosses
   * `du / de la / de l' / des`. It renders in italics, and the italics mean one
   * thing: French makes you say this word. Everywhere the same word is *not*
   * what the gap takes out it is dropped from the English instead, so the
   * translation reads the way English actually reads (see data/cards.ts).
   */
  implied?: boolean
}

/**
 * A learnable unit — the "one new thing" an i+1 card introduces.
 *
 * `surface` is the canonical French form (single word, or a fixed chunk like
 * "un peu"). `provides` overrides what surface unit(s) become known once this
 * element is learned; when omitted it defaults to the whole surface as a single
 * unit. Crucially, learning the chunk "un peu" does NOT make the bare word "un"
 * known — that is a separate element with its own card.
 */
export interface Element {
  id: string
  kind: ElementKind
  surface: string
  gloss: string
  provides?: string[][]
  /**
   * Agreement forms this card unlocks "for free" (rules.md: an ending is free
   * once the base word is known) — e.g. the plural `occupés` when the base
   * `occupé` is already learned. Unlike `provides`, these become known without
   * being highlighted, so a plural adjective sitting next to a new pronoun stays
   * un-highlighted rather than counting as the card's new thing.
   */
  free?: string[][]
  /**
   * On the reuse clock (md/rules.md rule 4): the deck must keep bringing this
   * one back, rather than leaving it to the scheduler.
   *
   * The test is **retrieve or assemble**. A word whose whole skill is recall —
   * `content`, `libre`, `boire` — is the SRS's job and is left unmarked; it
   * costs no cards. A word the learner has to *assemble* is the deck's job,
   * because assembly is a choice and a choice is only exercised against
   * alternatives, which one card cannot offer. Mark articles, connectors, and
   * constructions like `avoir besoin de` — where the surface may be an ordinary
   * noun but the skill is choosing `avoir`, keeping the `de`, and collapsing the
   * partitive behind it.
   *
   * Conjugated forms need no mark: engine/reuse.ts recognises them from their
   * gloss, so every verb joins the clock the moment it is taught.
   *
   * Marked from block 6 on. Earlier elements are unmarked because the quotas
   * that read this are grandfathered, not because they are all retrieve-class —
   * the staleness ledger reports them either way.
   */
  clock?: true
}

/**
 * One piece of a card's sentence, explained on its own.
 *
 * `part` is the stretch of French being explained, written exactly as it
 * appears on the card — except for a wrapped pair like `ne … pas`, which is
 * explained as the one thing it is and so is written with the verb elided out.
 */
export interface ExplainedPart {
  part: string
  note: string
}

/**
 * The full breakdown behind a card: what the sentence says, then every part of
 * it in turn, then what the parts add up to.
 *
 * `parts` covers the whole sentence — every word of the French appears in
 * exactly one part (enforced by data/explanations.test.ts), so nothing on the
 * card is left unexplained. `whole` is there when assembling the pieces teaches
 * something the pieces alone don't (word order, a fixed shape, a form that
 * survives or collapses); it is omitted when the breakdown already says it all.
 *
 * Each note names what kind of word the part is and what it means in English —
 * "This is a possessive adjective meaning your" — and then says how it behaves
 * in French, in English terms wherever the two languages differ.
 *
 * Explanations stand alone: no "you already know", no "you'll meet this later".
 */
export interface CardExplanation {
  summary: string
  parts: ExplainedPart[]
  whole?: string
}

export interface Card {
  id: string
  /**
   * id of the single new Element this card introduces (the i+1 "+1"). Omitted
   * on a "rest" card (rules.md rule 3): a full sentence that re-uses only known
   * words, holding the frame still to set up the next step. A rest card
   * highlights nothing and must be built entirely from already-known units.
   */
  element?: string
  segments: Segment[]
  /**
   * The English, with the counterpart of the blanked word highlighted — that is
   * what the answer bolds, so it points at the gloss of the word just filled in
   * whether or not the card teaches anything new. It is left plain only when the
   * blank has no English word of its own (`Est-ce que`, which asks the question
   * by being there where English asks by inverting).
   */
  translation: Segment[]
  /**
   * The word the gap takes out, written exactly as it appears in `segments`.
   *
   * A card with an element needs none: the gap goes to what the card teaches,
   * which the highlight already marks. A rest card highlights nothing, so the
   * gap falls to a heuristic (engine/fillBlank.ts) — good enough on most, but
   * it has no way past an elision, and on a sentence of short words it picks by
   * length. This names the word instead, and the translation's bold is written
   * to match it.
   */
  blank?: string
  /**
   * What TTS says when the natural spoken form differs from what `spokenForm`
   * derives from `segments` — the escape hatch for reductions the rules can't
   * see, e.g. the silent plural in "Ils parlent" → "I parle". Omit it and the
   * spoken form is derived automatically (see engine/speech.ts). Never shown on
   * screen: the learner always reads standard written French.
   */
  speech?: string
}

/**
 * FSRS memory state for one card. `stability` is the number of days until the
 * chance of recall decays to the target retention (≈ the current interval);
 * `difficulty` is 1 (trivial) to 10 (hard). The first grade a card receives
 * sets its initial stability, so a learner who already knows a word can grade
 * it "easy" and push it weeks out on first sight — the thing SM-2 could not do.
 */
export interface CardState {
  stability: number
  difficulty: number
  /**
   * Consecutive successful recalls; resets to 0 on "again". Recorded but not
   * currently read: FSRS schedules from stability and difficulty alone. Kept
   * because it is history that cannot be recovered once we stop writing it.
   */
  reps: number
  /** ISO timestamp the card is next due. */
  dueDate: string
  /** ISO timestamp of the most recent grade; '' if never reviewed. FSRS needs elapsed time to score recall. */
  lastReview: string
  /**
   * Local calendar day (YYYY-MM-DD) the card was first graded. Recorded but not
   * currently read — kept for the same reason as `reps`.
   */
  introducedDate: string
  /**
   * Set when the learner asked never to see this card again. It leaves the deck
   * without being forgotten: the memory state above is kept untouched, so
   * clearing the flag resumes the card exactly where it left off.
   */
  suspended?: boolean
}

export type Grade = 'again' | 'hard' | 'good' | 'easy'

/** What the learner does with a card once answered: schedule it, or retire it. */
export type ReviewChoice = Grade | 'never'

/**
 * What answering right and answering wrong do by default, so the common case
 * takes one press. These are the learner's own, not fixed: overriding the
 * interval after a correct answer becomes the new default for correct answers,
 * and likewise for wrong ones. The two are kept apart because they say
 * different things — how well you know the words you know, and how hard you
 * want to be chased on the ones you don't.
 */
export interface ReviewDefaults {
  correct: ReviewChoice
  wrong: ReviewChoice
}

/** The French (written) side of a card as a plain string — what is displayed. */
export function cardText(card: Card): string {
  return card.segments.map((s) => s.text).join('')
}

/**
 * What the TTS voice should speak: the card's explicit `speech` override when
 * it has one, otherwise the reduction derived from the written French. Display
 * always uses `cardText`; only audio uses this.
 */
export function cardSpeech(card: Card): string {
  return card.speech ?? spokenForm(cardText(card))
}

/**
 * The same sentence written in English spelling, so the learner can read back
 * what they just heard. Derived from `cardSpeech`, so it follows the voice —
 * including any `speech` override — rather than the written French.
 */
export function cardPhonetic(card: Card): string {
  return phoneticForm(cardSpeech(card))
}
