import { describe, expect, it } from 'vitest'
import { buildCloze, CHOICE_COUNT } from './cloze'
import { CARDS } from '../data/cards'
import { elementById } from '../data/elements'
import { cardText } from '../types'
import type { Card } from '../types'

const byId = (id: string) => CARDS.find((c) => c.id === id)!

describe('buildCloze', () => {
  it('blanks the highlighted element and leaves the rest of the sentence intact', () => {
    const question = buildCloze(byId('c4'), CARDS) // Je veux un [café]
    expect(question.answer).toBe('café')
    expect(question.before).toBe('Je veux un ')
    expect(question.after).toBe('')
    expect(question.before + question.answer + question.after).toBe(cardText(byId('c4')))
  })

  it('blanks a mid-sentence element without disturbing what follows', () => {
    const question = buildCloze(byId('c5'), CARDS) // Je veux [boire] un café
    expect(question.answer).toBe('boire')
    expect(question.after).toBe(' un café')
  })

  it('offers exactly four distinct choices, one of which is the answer', () => {
    for (const card of CARDS) {
      const { answer, choices } = buildCloze(card, CARDS)
      expect(choices).toHaveLength(CHOICE_COUNT)
      expect(choices).toContain(answer)
      expect(new Set(choices.map((c) => c.toLowerCase())).size).toBe(CHOICE_COUNT)
    }
  })

  it('always reassembles into the original sentence', () => {
    for (const card of CARDS) {
      const { before, answer, after } = buildCloze(card, CARDS)
      expect(before + answer + after).toBe(cardText(card))
      expect(answer.trim()).not.toBe('')
    }
  })

  it('is stable — same card, same options in the same order', () => {
    const card = byId('c20')
    expect(buildCloze(card, CARDS)).toEqual(buildCloze(card, CARDS))
  })

  it('draws distractors only from already-introduced elements once enough exist', () => {
    const card = byId('c100')
    const index = CARDS.findIndex((c) => c.id === card.id)
    const introduced = new Set(
      CARDS.slice(0, index + 1)
        .map((c) => c.element)
        .filter(Boolean)
        .map((id) => elementById[id!]?.surface.toLowerCase()),
    )
    const { answer, choices } = buildCloze(card, CARDS)
    for (const choice of choices) {
      if (choice === answer) continue
      expect(introduced).toContain(choice.toLowerCase())
    }
  })

  it('matches the capitalisation of the answer so casing gives nothing away', () => {
    const { choices } = buildCloze(byId('c20'), CARDS) // [Il] mange du pain
    for (const choice of choices) expect(choice[0]).toBe(choice[0].toUpperCase())
  })

  it('falls back to the longest word on a rest card, which highlights nothing', () => {
    const restCard: Card = {
      id: 'rest-test',
      segments: [{ text: 'Je mange du pain' }],
      translation: [{ text: 'I eat bread' }],
    }
    const question = buildCloze(restCard, CARDS)
    expect(question.answer).toBe('mange')
    expect(question.before + question.answer + question.after).toBe('Je mange du pain')
  })
})
