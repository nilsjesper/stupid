import { describe, it, expect } from 'vitest'
import { createDeck, SUITS, VALUES } from '../src/deck.js'

describe('createDeck', () => {
  it('builds a full 52-card deck', () => {
    expect(createDeck()).toHaveLength(52)
  })

  it('contains every suit/value combination exactly once', () => {
    const seen = createDeck().map((c) => `${c.value}-${c.suit}`)
    expect(new Set(seen).size).toBe(52)

    for (const suit of SUITS) {
      for (const value of VALUES) {
        expect(seen).toContain(`${value}-${suit}`)
      }
    }
  })

  it('shuffles — two decks should not come out in the same order', () => {
    const a = createDeck().map((c) => `${c.value}-${c.suit}`).join()
    const b = createDeck().map((c) => `${c.value}-${c.suit}`).join()
    expect(a).not.toBe(b)
  })
})
