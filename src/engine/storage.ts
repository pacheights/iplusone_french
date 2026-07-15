import type { CardState } from '../types'

const SRS_STATE_KEY = 'srs-state-v2'
const SRS_STATE_KEY_V1 = 'srs-state-v1'
const TTS_VOICE_KEY = 'tts-voice-v1'
const TTS_RATE_KEY = 'tts-rate-v1'
const LISTENING_PROGRESS_KEY = 'listening-progress-v1'
const NEW_WORDS_PER_DAY_KEY = 'new-words-per-day-v1'
const HIGHLIGHT_ENGLISH_KEY = 'highlight-english-v1'

export const DEFAULT_NEW_WORDS_PER_DAY = 10

/** How fast the voice speaks. 1 = normal; the Web Speech API accepts 0.1–10. */
export const DEFAULT_SPEECH_RATE = 1
export const MIN_SPEECH_RATE = 0.5
export const MAX_SPEECH_RATE = 1.5

/** Whether the target word is highlighted on the English (front) side. Off by default. */
export function loadHighlightEnglish(): boolean {
  return localStorage.getItem(HIGHLIGHT_ENGLISH_KEY) === 'true'
}

export function saveHighlightEnglish(on: boolean): void {
  localStorage.setItem(HIGHLIGHT_ENGLISH_KEY, String(on))
}

export function loadNewWordsPerDay(): number {
  const raw = localStorage.getItem(NEW_WORDS_PER_DAY_KEY)
  const n = raw ? Number(raw) : NaN
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : DEFAULT_NEW_WORDS_PER_DAY
}

export function saveNewWordsPerDay(n: number): void {
  localStorage.setItem(NEW_WORDS_PER_DAY_KEY, String(n))
}

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
 * Ids of listening items already shown in the current shuffle-bag cycle
 * (see `nextInCycle` in engine/listening.ts) — the last entry is the
 * question currently on screen, so reloading or switching tabs resumes
 * exactly where the learner left off instead of jumping to a new question.
 */
export function loadListeningSeenIds(): string[] {
  const raw = localStorage.getItem(LISTENING_PROGRESS_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.every((id) => typeof id === 'string') ? parsed : []
  } catch {
    return []
  }
}

export function saveListeningSeenIds(seenIds: string[]): void {
  localStorage.setItem(LISTENING_PROGRESS_KEY, JSON.stringify(seenIds))
}
