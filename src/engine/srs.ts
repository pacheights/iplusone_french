import type { CardState, Grade } from '../types'

const GRADE_QUALITY: Record<Grade, number> = {
  again: 0,
  hard: 3,
  good: 4,
  easy: 5,
}

/** Local calendar-day key (YYYY-MM-DD) — the learner's actual day, not UTC. */
export function localDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function createCardState(now: Date): CardState {
  return {
    interval: 0,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: now.toISOString(),
    introducedDate: localDateKey(now),
  }
}

export function isDue(state: CardState, now: Date): boolean {
  return new Date(state.dueDate).getTime() <= now.getTime()
}

export function gradeCard(state: CardState, grade: Grade, now: Date): CardState {
  const quality = GRADE_QUALITY[grade]

  let { repetitions, easeFactor } = state
  let interval: number

  if (quality < 3) {
    repetitions = 0
    interval = 1
  } else {
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 6
    } else {
      interval = Math.round(state.interval * easeFactor)
    }
    repetitions += 1
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
  )

  const dueDate = new Date(now)
  dueDate.setDate(dueDate.getDate() + interval)

  return {
    interval,
    repetitions,
    easeFactor,
    dueDate: dueDate.toISOString(),
    introducedDate: state.introducedDate,
  }
}
