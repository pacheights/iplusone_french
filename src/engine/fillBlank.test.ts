import { describe, expect, it } from 'vitest'
import { buildFillBlank, CHOICE_COUNT, REPEAT_WINDOW } from './fillBlank'
import { CARDS } from '../data/cards'
import { elementById } from '../data/elements'
import { cardText } from '../types'
import type { Card } from '../types'

const byId = (id: string) => CARDS.find((c) => c.id === id)!

describe('buildFillBlank', () => {
  it('blanks the highlighted element and leaves the rest of the sentence intact', () => {
    const question = buildFillBlank(byId('c3'), CARDS) // Je suis [fatigué]
    expect(question.answer).toBe('fatigué')
    expect(question.before).toBe('Je suis ')
    expect(question.after).toBe('')
    expect(question.before + question.answer + question.after).toBe(cardText(byId('c3')))
  })

  it('blanks a mid-sentence element without disturbing what follows', () => {
    const question = buildFillBlank(byId('c36'), CARDS) // Mon ami est [très] occupé
    expect(question.answer).toBe('très')
    expect(question.after).toBe(' occupé')
  })

  it('offers exactly four distinct choices, one of which is the answer', () => {
    for (const card of CARDS) {
      const { answer, choices } = buildFillBlank(card, CARDS)
      expect(choices).toHaveLength(CHOICE_COUNT)
      expect(choices).toContain(answer)
      expect(new Set(choices.map((c) => c.toLowerCase())).size).toBe(CHOICE_COUNT)
    }
  })

  it('always reassembles into the original sentence', () => {
    for (const card of CARDS) {
      const { before, answer, after } = buildFillBlank(card, CARDS)
      expect(before + answer + after).toBe(cardText(card))
      expect(answer.trim()).not.toBe('')
    }
  })

  it('is stable — same card, same options in the same order', () => {
    const card = byId('c20')
    expect(buildFillBlank(card, CARDS)).toEqual(buildFillBlank(card, CARDS))
  })

  it('draws distractors only from already-introduced elements once enough exist', () => {
    const card = byId('c111')
    const index = CARDS.findIndex((c) => c.id === card.id)
    const introduced = new Set(
      CARDS.slice(0, index + 1)
        .map((c) => c.element)
        .filter(Boolean)
        .map((id) => elementById[id!]?.surface.toLowerCase()),
    )
    const { answer, choices } = buildFillBlank(card, CARDS)
    for (const choice of choices) {
      if (choice === answer) continue
      expect(introduced).toContain(choice.toLowerCase())
    }
  })

  it('matches the capitalisation of the answer so casing gives nothing away', () => {
    const { choices } = buildFillBlank(byId('c27'), CARDS) // [On] est ici
    for (const choice of choices) expect(choice[0]).toBe(choice[0].toUpperCase())
  })

  it('blanks a vocabulary word, not the grammar around it, on a rest card', () => {
    const restCard: Card = {
      id: 'rest-test',
      segments: [{ text: 'Je mange du pain' }],
      translation: [{ text: 'I eat bread' }],
    }
    const question = buildFillBlank(restCard, CARDS)
    // "du" is a unit too, but a rest card drills words before it drills articles.
    expect(question.answer).toBe('pain')
    expect(question.before + question.answer + question.after).toBe('Je mange du pain')
  })

  it('takes the elided word without the letter fused to it', () => {
    const restCard: Card = {
      id: 'elision-test',
      segments: [{ text: "Il n'y a pas d'eau" }],
      translation: [{ text: 'There is no water' }],
    }
    const question = buildFillBlank(restCard, CARDS)
    expect(question.answer).toBe('eau')
    expect(question.before).toBe("Il n'y a pas d'")
  })

  it('blanks a fixed multi-word unit whole rather than half of it', () => {
    const restCard: Card = {
      id: 'whole-chunk-test',
      segments: [{ text: 'On veut quelque chose' }],
      translation: [{ text: 'We want something' }],
    }
    expect(buildFillBlank(restCard, CARDS).answer).toBe('quelque chose')
  })

  it('never repeats an answer across consecutive cards in the deck', () => {
    const answers = CARDS.map((card) => buildFillBlank(card, CARDS).answer.toLowerCase())
    for (let i = 1; i < answers.length; i++) {
      const card = CARDS[i]
      // A declared blank and a highlighted element are the deck's own choice —
      // only the rest-card fallback is obliged to move.
      if (card.element || card.blank) continue
      expect(answers.slice(Math.max(0, i - REPEAT_WINDOW), i)).not.toContain(answers[i])
    }
  })

  it('rotates the gap through a run of rest cards that vary one word', () => {
    // Four cards drilling the forms of avoir around a fixed noun. Blanking the
    // noun every time would drill the one word that never changes.
    const family = ['c48', 'c52', 'c53', 'c54']
      .map((id) => CARDS.find((c) => c.id === id))
      .filter((c): c is Card => Boolean(c))
    const answers = family.map((card) => buildFillBlank(card, CARDS).answer.toLowerCase())
    expect(new Set(answers).size).toBeGreaterThan(1)
  })

  it('blanks the word the card names, wherever the fallback would have gone', () => {
    // "Est-ce" is the longest token here and elision hides the chunk it belongs
    // to, so the fallback picks it — a fragment nobody can fill in. The named
    // blank overrides that, and the card's translation bolds "here" to match.
    const restCard: Card = {
      id: 'blank-test',
      segments: [{ text: "Est-ce qu'il est ici ?" }],
      blank: 'ici',
      translation: [{ text: 'Is he ' }, { text: 'here', highlight: 'vocab' }, { text: '?' }],
    }
    const question = buildFillBlank(restCard, CARDS)
    expect(question.answer).toBe('ici')
    expect(question.before).toBe("Est-ce qu'il est ")
    expect(question.after).toBe(' ?')
  })

  it('matches a named blank on letter boundaries, not inside a longer word', () => {
    const restCard: Card = {
      id: 'boundary-test',
      // "ami" sits inside "amis" three words earlier than the one meant.
      segments: [{ text: 'Mes amis sont ici, mon ami est là' }],
      blank: 'ami',
      translation: [{ text: 'My friends are here, my friend is there' }],
    }
    expect(buildFillBlank(restCard, CARDS).before).toBe('Mes amis sont ici, mon ')
  })

  it('blanks the trailing half when an element highlights two separated runs', () => {
    // ne … pas wraps the verb. "pas" is the half that carries the negation and
    // the half that survives speech — "ne" is dropped outright in everyday
    // French, so blanking it would ask the learner to hear what isn't said.
    expect(buildFillBlank(byId('c18'), CARDS).answer).toBe('pas') // Je [ne] suis [pas] malade
  })

  it('prefers the run that is exactly the element over the trailing one', () => {
    // Two highlighted runs, and the element's own surface is the *first* of
    // them — so the "exactly the element" rule has to beat "take the last run".
    const card: Card = {
      id: 'exact-run-test',
      element: 'le_bus',
      segments: [
        { text: 'Le bus', highlight: 'vocab' },
        { text: ' est ' },
        { text: 'en retard', highlight: 'grammar' },
      ],
      translation: [{ text: 'The bus is late' }],
    }
    expect(buildFillBlank(card, CARDS).answer).toBe('Le bus')
  })

  it('never blanks one word out of a fixed multi-word chunk on a rest card', () => {
    const restCard: Card = {
      id: 'chunk-test',
      segments: [{ text: 'Est-ce que vous voulez travailler ?' }],
      translation: [{ text: 'Do you want to work?' }],
    }
    // "Est-ce" is a long token, but it is half of `est-ce que`.
    expect(buildFillBlank(restCard, CARDS).answer).toBe('travailler')
  })
})
