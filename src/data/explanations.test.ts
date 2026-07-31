import { describe, expect, it } from 'vitest'
import { CARDS } from './cards'
import { EXPLANATIONS } from './explanations'
import { cardText } from '../types'
import { tokenize } from '../engine/tokenize'

/**
 * The explain panel promises to explain *all* of a card, so this is a coverage
 * proof: the parts of an explanation, laid end to end, must account for every
 * word of the sentence — no word skipped, none explained twice.
 *
 * Order is not checked. A wrapped negative is explained as the one thing it is
 * (`ne … pas`), which puts the verb it wraps after it rather than inside it.
 */
const bag = (tokens: string[]) => tokens.slice().sort()

describe('EXPLANATIONS', () => {
  it('has an entry for every card', () => {
    const missing = CARDS.filter((card) => !EXPLANATIONS[card.id]).map((card) => card.id)
    expect(missing).toEqual([])
  })

  it('has no entry for a card that does not exist', () => {
    const ids = new Set(CARDS.map((card) => card.id))
    expect(Object.keys(EXPLANATIONS).filter((id) => !ids.has(id))).toEqual([])
  })

  it('explains every word of every card exactly once', () => {
    const uncovered: string[] = []

    for (const card of CARDS) {
      const explanation = EXPLANATIONS[card.id]
      if (!explanation) continue

      const sentence = bag(tokenize(cardText(card)))
      const explained = bag(explanation.parts.flatMap((part) => tokenize(part.part)))

      if (sentence.join(' ') !== explained.join(' ')) {
        uncovered.push(`${card.id}: sentence [${sentence.join(' ')}] vs parts [${explained.join(' ')}]`)
      }
    }

    expect(uncovered).toEqual([])
  })

  it('has a non-empty summary and note everywhere', () => {
    const empty: string[] = []

    for (const [id, explanation] of Object.entries(EXPLANATIONS)) {
      if (!explanation.summary.trim()) empty.push(`${id}: summary`)
      if (!explanation.parts.length) empty.push(`${id}: no parts`)
      explanation.parts.forEach((part, i) => {
        if (!part.part.trim()) empty.push(`${id}: part ${i} text`)
        if (!part.note.trim()) empty.push(`${id}: part ${i} note`)
      })
      if (explanation.whole !== undefined && !explanation.whole.trim()) empty.push(`${id}: whole`)
    }

    expect(empty).toEqual([])
  })

  it('never says "you already know" or "you\'ll meet later"', () => {
    // rules.md: an explanation is read cold and has to stand on its own.
    const forbidden =
      /you (?:already|now) know|as you know|you'?ll (?:meet|see|learn)|later on|earlier card/i
    const offenders: string[] = []

    for (const [id, explanation] of Object.entries(EXPLANATIONS)) {
      const text = [explanation.summary, explanation.whole ?? '', ...explanation.parts.map((p) => p.note)]
      for (const chunk of text) {
        if (forbidden.test(chunk)) offenders.push(`${id}: ${chunk}`)
      }
    }

    expect(offenders).toEqual([])
  })
})
