import type { CardState } from '../types'

const SRS_STATE_KEY = 'srs-state-v1'
const TTS_VOICE_KEY = 'tts-voice-v1'
const LISTENING_PROGRESS_KEY = 'listening-progress-v1'
const NEW_WORDS_PER_DAY_KEY = 'new-words-per-day-v1'

export const DEFAULT_NEW_WORDS_PER_DAY = 10

export function loadNewWordsPerDay(): number {
  const raw = localStorage.getItem(NEW_WORDS_PER_DAY_KEY)
  const n = raw ? Number(raw) : NaN
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : DEFAULT_NEW_WORDS_PER_DAY
}

export function saveNewWordsPerDay(n: number): void {
  localStorage.setItem(NEW_WORDS_PER_DAY_KEY, String(n))
}

export function loadSrsState(): Record<string, CardState> {
  const raw = localStorage.getItem(SRS_STATE_KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as Record<string, CardState>
  } catch {
    return {}
  }
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
