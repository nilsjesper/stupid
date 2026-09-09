<template>
  <div id="app">
    <Status
      :current-value="currentValue"
      :game-status="gameStatus"
      :drawn="drawn"
      :remaining="remaining"
    />
    <Card :card="currentCard" @draw="newCard" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Status from './components/Status.vue'
import Card from './components/Card.vue'
import { createDeck, VALUES, type Card as PlayingCard, type CardValue } from './deck'
import type { GameStatus } from './types'

const deck = ref<PlayingCard[]>([])
const countIdx = ref(-1)
const currentValue = ref<CardValue | ''>('')
const currentCard = ref<PlayingCard | null>(null)
const drawn = ref(0)
const gameStatus = ref<GameStatus>('start')

const remaining = computed(() => deck.value.length)

// Resets every piece of state, including gameStatus, so it is safe to call
// from anywhere. newCard() overwrites gameStatus with 'playing' immediately
// after; without the assignment here, any other caller would leave the
// win/lose banner rendered over a freshly shuffled deck.
function reset () {
  deck.value = createDeck()
  countIdx.value = -1
  currentValue.value = ''
  currentCard.value = null
  drawn.value = 0
  gameStatus.value = 'start'
}

// One click = one draw. The spoken count cycles A..K forever; if it lands on
// the value you just drew, you lose. Empty the deck without a collision and
// you win.
function newCard () {
  if (gameStatus.value === 'win' || gameStatus.value === 'lose') {
    reset()
  }

  const card = deck.value.pop()
  // Unreachable: the deck is refilled by reset() above and 'win' fires the
  // moment it empties, so it is never empty here. Guards pop()'s T | undefined.
  if (!card) return

  gameStatus.value = 'playing'
  currentCard.value = card
  drawn.value++

  countIdx.value = (countIdx.value + 1) % VALUES.length
  currentValue.value = VALUES[countIdx.value]

  // A collision on the final card is still a loss. The pre-Vite version
  // checked win second and so overwrote the loss with a win.
  if (currentValue.value === card.value) {
    gameStatus.value = 'lose'
  } else if (deck.value.length === 0) {
    gameStatus.value = 'win'
  }
}

reset()
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 16px;
}
</style>
