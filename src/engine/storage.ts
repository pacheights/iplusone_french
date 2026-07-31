import type { CardState, ReviewChoice, ReviewDefaults } from '../types'

const SRS_STATE_KEY = 'srs-state-v2'
const SRS_STATE_KEY_V1 = 'srs-state-v1'
const TTS_VOICE_KEY = 'tts-voice-v1'
const TTS_RATE_KEY = 'tts-rate-v1'
const REVIEW_DEFAULTS_KEY = 'review-defaults-v1'
const SHOW_PHONETIC_KEY = 'show-phonetic-v1'
const MUTE_MODE_KEY = 'mute-mode-v1'
const LISTEN_FIRST_KEY = 'listen-first-v1'

/** How fast the voice speaks. 1 = normal; the Web Speech API accepts 0.1–10. */
const DEFAULT_SPEECH_RATE = 1
export const MIN_SPEECH_RATE = 0.5
export const MAX_SPEECH_RATE = 1.5

/** The pre-FSRS (SM-2) shape, kept only to migrate any saved v1 progress. */
interface LegacyCardState {
  interval: number
  repetitions: number
  easeFactor: number
  dueDate: string
  introducedDate: string
}

/**
 * Best-effort conversion of an SM-2 card into FSRS state. The SM-2 interval is
 * a decent proxy for stability (both are "days until due"), and ease maps
 * inversely onto difficulty (1.3 ease ≈ hard, 2.5+ ≈ easy). Exact continuity
 * isn't possible across models — this just preserves roughly where each card
 * sat rather than resetting the learner to zero.
 */
function migrateLegacy(old: LegacyCardState): CardState {
  const stability = Math.max(old.interval, 0.1)
  const difficulty = Math.min(10, Math.max(1, 11.5 - 2.6 * old.easeFactor))
  const lastReview = new Date(
    new Date(old.dueDate).getTime() - Math.max(old.interval, 0) * 86_400_000,
  ).toISOString()
  return {
    stability,
    difficulty,
    reps: old.repetitions,
    dueDate: old.dueDate,
    lastReview,
    introducedDate: old.introducedDate,
  }
}

export function loadSrsState(): Record<string, CardState> {
  const raw = localStorage.getItem(SRS_STATE_KEY)
  if (raw) {
    try {
      return JSON.parse(raw) as Record<string, CardState>
    } catch {
      return {}
    }
  }
  // One-time migration from the SM-2 (v1) format, if present.
  const legacyRaw = localStorage.getItem(SRS_STATE_KEY_V1)
  if (legacyRaw) {
    try {
      const legacy = JSON.parse(legacyRaw) as Record<string, LegacyCardState>
      const migrated: Record<string, CardState> = {}
      for (const [id, s] of Object.entries(legacy)) migrated[id] = migrateLegacy(s)
      return migrated
    } catch {
      return {}
    }
  }
  return {}
}

export function saveSrsState(states: Record<string, CardState>): void {
  localStorage.setItem(SRS_STATE_KEY, JSON.stringify(states))
}

/**
 * Where a learner starts before they've told the app anything: a correct answer
 * pushes the card out a few days, a wrong one brings it back this session.
 */
const INITIAL_REVIEW_DEFAULTS: ReviewDefaults = { correct: 'good', wrong: 'again' }

const REVIEW_CHOICES: ReviewChoice[] = ['again', 'hard', 'good', 'easy', 'never']

const isChoice = (v: unknown): v is ReviewChoice =>
  typeof v === 'string' && (REVIEW_CHOICES as string[]).includes(v)

/** Falls back per side, so one unreadable half doesn't discard the other. */
export function loadReviewDefaults(): ReviewDefaults {
  const raw = localStorage.getItem(REVIEW_DEFAULTS_KEY)
  if (!raw) return INITIAL_REVIEW_DEFAULTS
  try {
    const parsed = JSON.parse(raw) as Partial<ReviewDefaults>
    return {
      correct: isChoice(parsed?.correct) ? parsed.correct : INITIAL_REVIEW_DEFAULTS.correct,
      wrong: isChoice(parsed?.wrong) ? parsed.wrong : INITIAL_REVIEW_DEFAULTS.wrong,
    }
  } catch {
    return INITIAL_REVIEW_DEFAULTS
  }
}

export function saveReviewDefaults(defaults: ReviewDefaults): void {
  localStorage.setItem(REVIEW_DEFAULTS_KEY, JSON.stringify(defaults))
}

export function loadVoiceURI(): string | null {
  return localStorage.getItem(TTS_VOICE_KEY)
}

export function saveVoiceURI(voiceURI: string): void {
  localStorage.setItem(TTS_VOICE_KEY, voiceURI)
}

export function loadSpeechRate(): number {
  const raw = localStorage.getItem(TTS_RATE_KEY)
  const n = raw ? Number(raw) : NaN
  if (!Number.isFinite(n)) return DEFAULT_SPEECH_RATE
  return Math.min(MAX_SPEECH_RATE, Math.max(MIN_SPEECH_RATE, n))
}

export function saveSpeechRate(rate: number): void {
  localStorage.setItem(TTS_RATE_KEY, String(rate))
}

/**
 * The pronunciation line under an answered sentence. On by default: a learner
 * who doesn't need the crutch turns it off, but one who does shouldn't have to
 * discover the setting to get it.
 */
const DEFAULT_SHOW_PHONETIC = true

export function loadShowPhonetic(): boolean {
  const raw = localStorage.getItem(SHOW_PHONETIC_KEY)
  if (raw === null) return DEFAULT_SHOW_PHONETIC
  return raw === 'true'
}

export function saveShowPhonetic(show: boolean): void {
  localStorage.setItem(SHOW_PHONETIC_KEY, String(show))
}

/**
 * Mute mode: the English shows before the answer instead of after it, for a
 * learner who can't turn the sound on. Off by default — with the audio playing,
 * the English up front would answer the question for you.
 */
const DEFAULT_MUTE_MODE = false

export function loadMuteMode(): boolean {
  const raw = localStorage.getItem(MUTE_MODE_KEY)
  if (raw === null) return DEFAULT_MUTE_MODE
  return raw === 'true'
}

export function saveMuteMode(mute: boolean): void {
  localStorage.setItem(MUTE_MODE_KEY, String(mute))
}

/**
 * Listen first: the question stays covered until the sentence has finished
 * playing, so the ear does the work before the eye gets a chance. Off by
 * default — it's a discipline a learner chooses, not one to impose on arrival.
 */
const DEFAULT_LISTEN_FIRST = false

export function loadListenFirst(): boolean {
  const raw = localStorage.getItem(LISTEN_FIRST_KEY)
  if (raw === null) return DEFAULT_LISTEN_FIRST
  return raw === 'true'
}

export function saveListenFirst(listen: boolean): void {
  localStorage.setItem(LISTEN_FIRST_KEY, String(listen))
}

