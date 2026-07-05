import { describe, expect, it } from 'vitest'
import { validateDeck } from './i1'

describe('CARDS', () => {
  it('is a valid i+1 progression', () => {
    expect(validateDeck()).toEqual([])
  })
})
