import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Card from '../src/components/Card.vue'
import Status from '../src/components/Status.vue'
import type { GameStatus } from '../src/types'

describe('Card', () => {
  it('renders blank with no card and does not crash', () => {
    const wrapper = mount(Card, { props: { card: null } })
    expect(wrapper.find('.value').exists()).toBe(false)
    expect(wrapper.find('.card').classes()).toEqual(['card'])
  })

  it('renders the value, suit symbol, and suit class', () => {
    const wrapper = mount(Card, { props: { card: { value: 'Q', suit: 'heart' } } })
    expect(wrapper.find('.value').text()).toBe('Q')
    expect(wrapper.find('.symbol').text()).toBe('♥︎')
    expect(wrapper.find('.card').classes()).toContain('heart')
  })

  it('emits draw when clicked', async () => {
    const wrapper = mount(Card, { props: { card: null } })
    await wrapper.find('.card').trigger('click')
    expect(wrapper.emitted('draw')).toHaveLength(1)
  })

  it('is a real button so it is keyboard reachable', () => {
    const wrapper = mount(Card, { props: { card: null } })
    const el = wrapper.find('.card')
    expect(el.element.tagName).toBe('BUTTON')
    expect(el.attributes('type')).toBe('button')
  })

  it('labels itself for screen readers, naming the suit', () => {
    const blank = mount(Card, { props: { card: null } })
    expect(blank.find('.card').attributes('aria-label')).toBe('Draw a card')

    const drawn = mount(Card, { props: { card: { value: 'Q', suit: 'heart' } } })
    expect(drawn.find('.card').attributes('aria-label')).toBe('Q of hearts. Draw again.')
  })

  it('hides the decorative suit glyph from screen readers', () => {
    const wrapper = mount(Card, { props: { card: { value: 'Q', suit: 'heart' } } })
    expect(wrapper.find('.symbol').attributes('aria-hidden')).toBe('true')
  })
})

describe('Status', () => {
  const base = { currentValue: '', gameStatus: 'start' as GameStatus, drawn: 0, remaining: 52 }

  it('prompts before the game starts', () => {
    const wrapper = mount(Status, { props: base })
    expect(wrapper.text()).toContain('Click the card to begin')
  })

  it('announces changes through a live region', () => {
    const wrapper = mount(Status, { props: base })
    const panel = wrapper.find('.status-panel')
    expect(panel.attributes('role')).toBe('status')
    expect(panel.attributes('aria-live')).toBe('polite')
  })

  it('gives the count a phrasing that reads aloud sensibly', () => {
    const wrapper = mount(Status, {
      props: { ...base, currentValue: '7', gameStatus: 'playing' as GameStatus }
    })
    expect(wrapper.find('.sr-only').text()).toBe('Count: 7')
    expect(wrapper.find('.status').attributes('aria-hidden')).toBe('true')
  })

  it('shows the count and progress while playing', () => {
    const wrapper = mount(Status, {
      props: { ...base, currentValue: '7', gameStatus: 'playing', drawn: 7, remaining: 45 }
    })
    expect(wrapper.text()).toContain('"7"!')
    expect(wrapper.text()).toContain('7 down, 45 to go')
  })
})
