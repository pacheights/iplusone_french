import { spokenForm } from './engine/speech'

export type ElementKind = 'vocab' | 'grammar'

export interface Segment {
  text: string
  highlight?: ElementKind
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
  note?: string
  provides?: string[][]
  /**
   * Agreement forms this card unlocks "for free" (rules.md: an ending is free
   * once the base word is known) — e.g. the plural `occupés` when the base
   * `occupé` is already learned. Unlike `provides`, these become known without
   * being highlighted, so a plural adjective sitting next to a new pronoun stays
   * un-highlighted rather than counting as the card's new thing.
   */
  free?: string[][]
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
  translation: Segment[]
  /**
   * Optional grammar explanation shown on this card only, independent of its
   * element. Use it when a card reinforces a rule that belongs to no single new
   * word — e.g. the partitive collapsing to `de` under negation.
   */
  note?: string
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
   * Consecutive successful recalls; resets to 0 on "again". Not used by the
   * scheduler — it only gates listening vocabulary ("recalled ≥ once and not
   * currently lapsed"), see engine/listening.ts.
   */
  reps: number
  /** ISO timestamp the card is next due. */
  dueDate: string
  /** ISO timestamp of the most recent grade; '' if never reviewed. FSRS needs elapsed time to score recall. */
  lastReview: string
  /** Local calendar day (YYYY-MM-DD) the card was first graded — used to cap new words per day. */
  introducedDate: string
}

export type Grade = 'again' | 'hard' | 'good' | 'easy'

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
