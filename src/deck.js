// Suit names double as CSS classes in Card.vue; keep them in sync.
const SUITS = ['spade', 'heart', 'diamond', 'club']
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

// Returns a freshly shuffled 52-card deck. Callers draw with pop(), so
// "remaining" is just the array length.
export function createDeck () {
  const deck = []
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

export { SUITS, VALUES }
