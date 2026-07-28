import { describe, expect, it } from 'vitest'
import { spokenForm } from './speech'
import { CARDS } from '../data/cards'
import { cardSpeech, cardText } from '../types'

/**
 * Every expectation here is a pronunciation that was hand-written first and the
 * rules were derived from — so these pin the rules against real judgements
 * about how the sentences actually sound, not against the implementation.
 */
describe('spokenForm', () => {
  it('drops the schwa in je before a consonant', () => {
    expect(spokenForm('Je parle')).toBe("J'parle")
    expect(spokenForm('Je mange du pain')).toBe("J'mange du pain")
    expect(spokenForm('Moi, je mange du pain')).toBe("Moi, j'mange du pain")
  })

  it('collapses je suis and je sais', () => {
    expect(spokenForm('Je suis fatigué')).toBe('Chuis fatigué')
    expect(spokenForm('Je sais')).toBe('Chais')
    expect(spokenForm('Je pense que oui, mais je ne sais pas')).toBe(
      "J'pense que oui, mais chais pas",
    )
  })

  it('drops ne, and re-elides what that exposes', () => {
    expect(spokenForm('Je ne parle pas français')).toBe("J'parle pas français")
    expect(spokenForm("Je n'ai pas faim")).toBe("J'ai pas faim")
    expect(spokenForm("Je n'en veux pas")).toBe("J'en veux pas")
    expect(spokenForm("Je n'y vais pas")).toBe("J'y vais pas")
    expect(spokenForm("Ce n'est pas un café")).toBe("C'est pas un café")
    expect(spokenForm('Je ne veux rien')).toBe("J'veux rien")
  })

  it('drops ne only in the clause that is negated', () => {
    expect(spokenForm("Je le sais, mais je ne le dis pas")).toBe("J'le sais, mais j'le dis pas")
  })

  it('leaves ne alone when there is no negation word', () => {
    // "plus" here is the comparative "more", not part of a negation.
    expect(spokenForm('Je suis plus grand que mon ami')).toBe('Chuis plus grand que mon ami')
  })

  it('reduces il y a and impersonal il faut', () => {
    expect(spokenForm('Il y a du pain')).toBe("Y'a du pain")
    expect(spokenForm("Il n'y a pas de pain")).toBe("Y'a pas de pain")
    expect(spokenForm('Il y en a')).toBe("Y'en a")
    expect(spokenForm('Il faut manger')).toBe('Faut manger')
  })

  it('reduces subject il / ils / elle to a bare vowel before a consonant', () => {
    expect(spokenForm('Il parle français')).toBe('I parle français')
    expect(spokenForm('Ils sont français')).toBe('I sont français')
    expect(spokenForm('Elle parle français')).toBe('È parle français')
    expect(spokenForm("Elle m'appelle")).toBe("È m'appelle")
  })

  it('opens the vowel in il est but keeps the l', () => {
    expect(spokenForm('Il est français')).toBe('Il è français')
  })

  it('elides tu before a vowel', () => {
    expect(spokenForm('Est-ce que tu es français ?')).toBe("Est-ce que t'es français ?")
    expect(spokenForm('Est-ce que tu as du pain ?')).toBe("Est-ce que t'as du pain ?")
  })

  it("never reduces the il inside s'il or qu'il", () => {
    expect(spokenForm("Je voudrais un café, s'il vous plaît")).toBe(
      "J'voudrais un café, s'il vous plaît",
    )
  })

  it('leaves a sentence with nothing to reduce untouched', () => {
    expect(spokenForm('Vous êtes heureux')).toBe('Vous êtes heureux')
    expect(spokenForm('Mon ami est là')).toBe('Mon ami est là')
  })
})

describe('cardSpeech', () => {
  it('prefers an explicit per-card override over the derived form', () => {
    const card = CARDS[0]
    expect(cardSpeech({ ...card, speech: 'anything' })).toBe('anything')
  })

  it('derives the spoken form for every card without an override', () => {
    for (const card of CARDS) {
      if (card.speech) continue
      expect(cardSpeech(card)).toBe(spokenForm(cardText(card)))
    }
  })

  it('never produces an empty utterance', () => {
    for (const card of CARDS) expect(cardSpeech(card).trim()).not.toBe('')
  })
})
