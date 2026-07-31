import { describe, expect, it } from 'vitest'
import { phoneticForm, unknownWords } from './phonetic'
import { CARDS } from '../data/cards'
import { cardPhonetic, cardSpeech } from '../types'

describe('phoneticForm', () => {
  it('writes the reduction the voice actually says', () => {
    // "Je suis" is spoken as one syllable, so it is read as one word.
    expect(phoneticForm('Chuis fatigué')).toBe('Shuis fa-tee-gay')
    expect(phoneticForm("Y'a un bus")).toBe('Ya uhn bews')
  })

  it('runs a liaison onto the word it belongs to', () => {
    expect(phoneticForm('Vous êtes occupé ?')).toBe('Voo-zet-zoh-kew-pay?')
    expect(phoneticForm('On est en retard')).toBe('Oh-nay-tahn ruh-tar')
    expect(phoneticForm('Nous avons des amis')).toBe('Noo-za-vohn day-za-mee')
  })

  it('reads a phrase said as one word as one word', () => {
    expect(phoneticForm('Est-ce que tu veux un café ?')).toBe('Ess-kuh tew vuh uhn ka-fay?')
    expect(phoneticForm("Est-ce qu'il è ici ?")).toBe('Ess-kee-leh ee-see?')
  })

  it('keeps punctuation where it was', () => {
    expect(phoneticForm('Chuis fatigué, mais chuis content')).toBe(
      'Shuis fa-tee-gay, may shuis kohn-tahn',
    )
  })
})

describe('the deck', () => {
  it('has a sound for every word every card says', () => {
    const missing = new Set<string>()
    for (const card of CARDS) {
      for (const word of unknownWords(cardSpeech(card))) missing.add(word)
    }
    expect([...missing]).toEqual([])
  })

  it('reads back every card without an empty or doubled gap', () => {
    for (const card of CARDS) {
      const phonetic = cardPhonetic(card)
      expect(phonetic, card.id).toMatch(/\p{L}/u)
      expect(phonetic, card.id).not.toMatch(/\s\s|^\s|\s$/)
    }
  })
})
