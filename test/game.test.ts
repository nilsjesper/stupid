import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import type { Card, CardValue } from '../src/deck'

const { deckRef } = vi.hoisted(() => ({ deckRef: { cards: [] as Card[] } }))

vi.mock('../src/deck', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../src/deck')>()),
  createDeck: () => deckRef.cards.slice()
}))

import App from '../src/App.vue'

// App draws with pop(), so the deck array is built back-to-front from the
// order we want the cards to come out in.
function stackDeck (drawOrder: CardValue[]) {
  deckRef.cards = drawOrder.map((value) => ({ value, suit: 'spade' as const })).reverse()
}

function many (count: number, value: CardValue): CardValue[] {
  return Array.from({ length: count }, () => value)
}

async function draw (wrapper: VueWrapper, times = 1) {
  for (let i = 0; i < times; i++) {
    await wrapper.find('.card').trigger('click')
  }
}

// Dispatched on a real node so the event bubbles to the window listener.
function pressKey (code: string, target: EventTarget = document.body) {
  const event = new KeyboardEvent('keydown', { code, bubbles: true, cancelable: true })
  target.dispatchEvent(event)
  return event
}

// App registers a window keydown listener, so every instance must be torn
// down or its listener leaks into later tests and draws extra cards.
const mounted: VueWrapper[] = []

function mountApp () {
  const wrapper = mount(App, { attachTo: document.body })
  mounted.push(wrapper)
  return wrapper
}

afterEach(() => {
  while (mounted.length) mounted.pop()!.unmount()
})

describe('game flow', () => {
  beforeEach(() => {
    stackDeck(['K'])
  })

  it('starts before any draw', () => {
    const wrapper = mountApp()
    expect(wrapper.text()).toContain('Click the card or press space to begin')
  })

  it('counts up from A and depletes the deck as you draw', async () => {
    stackDeck(['K', 'K', 'K'])
    const wrapper = mountApp()

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
    stackDeck(['2', ...many(12, 'A'), '2', 'K'])
    const wrapper = mountApp()

    await draw(wrapper, 13)
    expect(wrapper.text()).toContain('"K"!')

    await draw(wrapper)
    expect(wrapper.text()).toContain('"A"!')
    expect(wrapper.text()).toContain('14 down, 1 to go')
  })

  it('loses when the count matches the drawn card', async () => {
    stackDeck(['A', 'K'])
    const wrapper = mountApp()

    await draw(wrapper)
    expect(wrapper.text()).toContain('You lost with 1 to go!')
    expect(wrapper.text()).toContain('Try Again?')
  })

  it('wins when the deck empties without a collision', async () => {
    stackDeck(['K', 'K'])
    const wrapper = mountApp()

    await draw(wrapper, 2)
    expect(wrapper.text()).toContain('Holy crap, you won!')
  })

  it('treats a collision on the final card as a loss, not a win', async () => {
    // Second draw: count is on 2 and the card is a 2, with the deck now empty.
    stackDeck(['K', '2'])
    const wrapper = mountApp()

    await draw(wrapper, 2)
    expect(wrapper.text()).toContain('You lost with 0 to go!')
    expect(wrapper.text()).not.toContain('you won')
  })

  it('reshuffles a full deck when you click after losing', async () => {
    stackDeck(['A', ...many(51, 'K')])
    const wrapper = mountApp()

    await draw(wrapper)
    expect(wrapper.text()).toContain('You lost with 51 to go!')

    // Re-stack with a safe first card so the post-loss click keeps playing.
    // Seeing "1 down, 51 to go" proves reset() refilled the deck to 52 and
    // restarted both the draw tally and the count.
    stackDeck(many(52, 'K'))
    await draw(wrapper)
    expect(wrapper.text()).toContain('1 down, 51 to go')
    expect(wrapper.text()).toContain('"A"!')
  })
})

describe('space bar', () => {
  beforeEach(() => {
    stackDeck(many(52, 'K'))
  })

  it('draws when space is pressed anywhere on the page', async () => {
    const wrapper = mountApp()

    pressKey('Space')
    await nextTick()
    expect(wrapper.text()).toContain('"A"!')
    expect(wrapper.text()).toContain('1 down, 51 to go')

    pressKey('Space')
    await nextTick()
    expect(wrapper.text()).toContain('"2"!')
    expect(wrapper.text()).toContain('2 down, 50 to go')
  })

  it('prevents the default so the page does not scroll', () => {
    mountApp()

    expect(pressKey('Space').defaultPrevented).toBe(true)
  })

  it('ignores keys other than space', async () => {
    const wrapper = mountApp()

    pressKey('KeyA')
    pressKey('Enter')
    pressKey('ArrowRight')
    await nextTick()
    expect(wrapper.text()).toContain('Click the card or press space to begin')
  })

  it('leaves space to the card when the card is focused, so one press is one draw', async () => {
    const wrapper = mountApp()
    const button = wrapper.find('.card').element

    // A real browser turns this keypress into a click on the focused button.
    // jsdom does not, so this asserts the guard that stops the global handler
    // from drawing a second card on top of that native activation.
    expect(pressKey('Space', button).defaultPrevented).toBe(false)
    await nextTick()
    expect(wrapper.text()).toContain('Click the card or press space to begin')
  })

  it('stops listening once unmounted', async () => {
    // Deliberately untracked: this test unmounts by hand, and afterEach must
    // not try to unmount it a second time.
    const wrapper = mount(App, { attachTo: document.body })
    pressKey('Space')
    await nextTick()
    expect(wrapper.text()).toContain('1 down, 51 to go')

    wrapper.unmount()
    // No listener left, so nothing claims the keypress.
    expect(pressKey('Space').defaultPrevented).toBe(false)
  })
})
