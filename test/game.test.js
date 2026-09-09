import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

const { deckRef } = vi.hoisted(() => ({ deckRef: { cards: [] } }))

vi.mock('../src/deck.js', async (importOriginal) => ({
  ...(await importOriginal()),
  createDeck: () => deckRef.cards.slice()
}))

import App from '../src/App.vue'

// App draws with pop(), so the deck array is built back-to-front from the
// order we want the cards to come out in.
function stackDeck (drawOrder) {
  deckRef.cards = drawOrder
    .map((value) => ({ value, suit: 'spade' }))
    .reverse()
}

async function draw (wrapper, times = 1) {
  for (let i = 0; i < times; i++) {
    await wrapper.find('.card').trigger('click')
  }
}

describe('game flow', () => {
  beforeEach(() => {
    stackDeck(['K'])
  })

  it('starts before any draw', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Click the card to begin')
  })

  it('counts up from A and depletes the deck as you draw', async () => {
    stackDeck(['K', 'K', 'K'])
    const wrapper = mount(App)

    await draw(wrapper)
    expect(wrapper.text()).toContain('"A"!')
    expect(wrapper.text()).toContain('1 down, 2 to go')

    await draw(wrapper)
    expect(wrapper.text()).toContain('"2"!')
    expect(wrapper.text()).toContain('2 down, 1 to go')
  })

  it('wraps the count from K back to A', async () => {
    // Count runs A,2..K,A. 'A' cards are safe except when the count is on A.
    // The trailing card keeps the deck non-empty so draw 14 is not a win.
    stackDeck(['2', ...Array(12).fill('A'), '2', 'K'])
    const wrapper = mount(App)

    await draw(wrapper, 13)
    expect(wrapper.text()).toContain('"K"!')

    await draw(wrapper)
    expect(wrapper.text()).toContain('"A"!')
    expect(wrapper.text()).toContain('14 down, 1 to go')
  })

  it('loses when the count matches the drawn card', async () => {
    stackDeck(['A', 'K'])
    const wrapper = mount(App)

    await draw(wrapper)
    expect(wrapper.text()).toContain('You lost with 1 to go!')
    expect(wrapper.text()).toContain('Try Again?')
  })

  it('wins when the deck empties without a collision', async () => {
    stackDeck(['K', 'K'])
    const wrapper = mount(App)

    await draw(wrapper, 2)
    expect(wrapper.text()).toContain('Holy crap, you won!')
  })

  it('treats a collision on the final card as a loss, not a win', async () => {
    // Second draw: count is on 2 and the card is a 2, with the deck now empty.
    stackDeck(['K', '2'])
    const wrapper = mount(App)

    await draw(wrapper, 2)
    expect(wrapper.text()).toContain('You lost with 0 to go!')
    expect(wrapper.text()).not.toContain('you won')
  })

  it('reshuffles a full deck when you click after losing', async () => {
    stackDeck(['A', ...Array(51).fill('K')])
    const wrapper = mount(App)

    await draw(wrapper)
    expect(wrapper.text()).toContain('You lost with 51 to go!')

    // The click after a loss resets before drawing, so the draw count restarts
    // at 1 and the deck is back to 52 rather than continuing to deplete.
    await draw(wrapper)
    expect(wrapper.vm.drawn).toBe(1)
    expect(wrapper.vm.remaining).toBe(51)
  })
})
