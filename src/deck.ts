// Suit names double as CSS classes in Card.vue; keep them in sync.
export const SUITS = ['spade', 'heart', 'diamond', 'club'] as const
export const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const

export type Suit = (typeof SUITS)[number]
export type CardValue = (typeof VALUES)[number]

export type Card = {
  value: CardValue
  suit: Suit
}

// Returns a freshly shuffled 52-card deck. Callers draw with pop(), so
// "remaining" is just the array length.
export function createDeck (): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ value, suit })
    }
  }

  // Fisher-Yates
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const swap = deck[i]
    deck[i] = deck[j]
    deck[j] = swap
  }

  return deck
}
