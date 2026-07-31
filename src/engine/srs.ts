import type { CardState, Grade } from '../types'

/**
 * FSRS (Free Spaced Repetition Scheduler) — the DSR memory model that replaced
 * SM-2 as Anki's default scheduler. Each card carries a *stability* (days until
 * the chance of recall decays to the target retention) and a *difficulty*
 * (1–10). Unlike SM-2, the very first grade sets the card's initial stability,
 * so a learner who already knows a word can grade it "easy" and push it weeks
 * out immediately instead of seeing it again tomorrow.
 */

/** Grade → FSRS rating G (1 = again, 2 = hard, 3 = good, 4 = easy). */
const RATING: Record<Grade, number> = { again: 1, hard: 2, good: 3, easy: 4 }

/**
 * FSRS-5 default weights. w[0..3] are the initial stabilities (in days) for
 * again/hard/good/easy on first exposure — note how far apart easy (~15.7) is
 * from good (~3.2), hard (~1.2) and again (~0.4). The rest govern how
 * difficulty evolves and how stability grows on each subsequent review.
 */
const W = [
  0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575,
  0.1192, 1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898,
] as const

/** Target probability of recall when a card comes due. Higher ⇒ more reviews. */
const REQUEST_RETENTION = 0.9

// Forgetting curve R(t) = (1 + FACTOR·t/S)^DECAY. These constants are fixed by
// the FSRS model: DECAY = -0.5 ⇒ FACTOR = 19/81. A tidy consequence at 90%
// retention is that the due interval in days equals the stability exactly.
const DECAY = -0.5
const FACTOR = 19 / 81

const MS_PER_DAY = 86_400_000
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x))

/** Local calendar-day key (YYYY-MM-DD) — the learner's actual day, not UTC. */
export function localDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** A never-reviewed placeholder; its real stability is set by the first grade. */
export function createCardState(now: Date): CardState {
  return {
    stability: 0,
    difficulty: 0,
    reps: 0,
    dueDate: now.toISOString(),
    lastReview: '',
    introducedDate: localDateKey(now),
  }
}

export function isDue(state: CardState, now: Date): boolean {
  return new Date(state.dueDate).getTime() <= now.getTime()
}

/** Probability the card is still recalled after `elapsedDays` at stability `s`. */
function retrievability(s: number, elapsedDays: number): number {
  return Math.pow(1 + FACTOR * (elapsedDays / s), DECAY)
}

/** Days until stability `s` decays to the target retention — the next interval. */
function intervalDays(s: number): number {
  return (s / FACTOR) * (Math.pow(REQUEST_RETENTION, 1 / DECAY) - 1)
}

/** Initial difficulty for a first grade `g` (easy ⇒ low, again ⇒ high). */
function initialDifficulty(g: number): number {
  return clamp(W[4] - Math.exp(W[5] * (g - 1)) + 1, 1, 10)
}

/** Next difficulty, mean-reverting toward the "easy" anchor so it can recover. */
function nextDifficulty(d: number, g: number): number {
  const delta = -W[6] * (g - 3)
  const damped = d + delta * ((10 - d) / 9)
  return clamp(W[7] * initialDifficulty(4) + (1 - W[7]) * damped, 1, 10)
}

/** Stability after a successful recall — grows more when recall was less certain. */
function stabilityAfterRecall(d: number, s: number, r: number, g: number): number {
  const hardPenalty = g === 2 ? W[15] : 1
  const easyBonus = g === 4 ? W[16] : 1
  return (
    s *
    (1 +
      Math.exp(W[8]) *
        (11 - d) *
        Math.pow(s, -W[9]) *
        (Math.exp((1 - r) * W[10]) - 1) *
        hardPenalty *
        easyBonus)
  )
}

/** Stability after a lapse ("again") — never rises above the pre-lapse value. */
function stabilityAfterLapse(d: number, s: number, r: number): number {
  const postLapse =
    W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp((1 - r) * W[14])
  return Math.min(postLapse, s)
}

export const GRADES: Grade[] = ['again', 'hard', 'good', 'easy']

/**
 * Retire a card from the queue without erasing what the learner built up on it.
 * Nothing about the memory state changes — only the flag — so a card taken out
 * this way can be put back later and pick up its old schedule rather than
 * starting over as new.
 */
export function suspendCard(state: CardState): CardState {
  return { ...state, suspended: true }
}

/**
 * What each grade would do to this card, so the learner can be shown the four
 * outcomes before choosing one. It runs the real scheduler rather than
 * re-deriving the maths, so the preview and the eventual grade can't drift.
 */
export function previewSchedule(state: CardState, now: Date): Record<Grade, Date> {
  const preview = {} as Record<Grade, Date>
  for (const grade of GRADES) {
    preview[grade] = new Date(gradeCard(state, grade, now).dueDate)
  }
  return preview
}

/**
 * A due date said the way a learner thinks about it — "Today", "Tomorrow",
 * "4 days", "3 months". Sub-day intervals (a lapsed card coming back this
 * session) read as "Today"; past a month the day count stops meaning anything,
 * so it rounds up to months and then years.
 */
export function describeInterval(due: Date, now: Date): string {
  const days = (due.getTime() - now.getTime()) / MS_PER_DAY
  if (days < 1) return 'Today'
  if (days < 2) return 'Tomorrow'
  if (days < 30) return `${Math.round(days)} days`
  if (days < 365) {
    const months = Math.round(days / 30)
    return months === 1 ? '1 month' : `${months} months`
  }
  const years = Math.round((days / 365) * 10) / 10
  return years === 1 ? '1 year' : `${years} years`
}

export function gradeCard(state: CardState, grade: Grade, now: Date): CardState {
  const g = RATING[grade]
  const firstReview = !state.lastReview

  let stability: number
  let difficulty: number
  if (firstReview) {
    stability = W[g - 1]
    difficulty = initialDifficulty(g)
  } else {
    const elapsedDays = Math.max(0, (now.getTime() - new Date(state.lastReview).getTime()) / MS_PER_DAY)
    const r = retrievability(state.stability, elapsedDays)
    difficulty = nextDifficulty(state.difficulty, g)
    stability =
      g === 1
        ? stabilityAfterLapse(state.difficulty, state.stability, r)
        : stabilityAfterRecall(state.difficulty, state.stability, r, g)
  }
  stability = Math.max(stability, 0.1)

  // Whole-day intervals once a card graduates past a day; keep sub-day (hours)
  // for short lapses so an "again" card comes back within the same session.
  const raw = intervalDays(stability)
  const dueMs = (raw >= 1 ? Math.round(raw) : raw) * MS_PER_DAY
  const dueDate = new Date(now.getTime() + dueMs)

  return {
    stability,
    difficulty,
    reps: g === 1 ? 0 : state.reps + 1,
    dueDate: dueDate.toISOString(),
    lastReview: now.toISOString(),
    introducedDate: state.introducedDate,
  }
}
