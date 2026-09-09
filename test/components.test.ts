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
})

describe('Status', () => {
  const base = { currentValue: '', gameStatus: 'start' as GameStatus, drawn: 0, remaining: 52 }

  it('prompts before the game starts', () => {
    const wrapper = mount(Status, { props: base })
    expect(wrapper.text()).toContain('Click the card to begin')
  })

  it('shows the count and progress while playing', () => {
    const wrapper = mount(Status, {
      props: { ...base, currentValue: '7', gameStatus: 'playing', drawn: 7, remaining: 45 }
    })
    expect(wrapper.text()).toContain('"7"!')
    expect(wrapper.text()).toContain('7 down, 45 to go')
  })
})
