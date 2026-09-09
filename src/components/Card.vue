<template>
  <button
    type="button"
    class="card"
    :class="suit"
    :aria-label="label"
    @click="$emit('draw')"
  >
    <span v-if="card" class="value">{{ card.value }}</span>
    <span v-if="card" class="symbol" aria-hidden="true">{{ symbol }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Card, Suit } from '../deck'

const SYMBOLS: Record<Suit, string> = {
  diamond: '♦️',
  heart: '♥︎',
  club: '♣️',
  spade: '♠️'
}

// Suit is conveyed visually by glyph and colour only, so spell it out for
// screen readers.
const SUIT_NAMES: Record<Suit, string> = {
  diamond: 'diamonds',
  heart: 'hearts',
  club: 'clubs',
  spade: 'spades'
}

// null before the first draw, which renders a blank card face.
const props = withDefaults(defineProps<{ card?: Card | null }>(), { card: null })

defineEmits<{ draw: [] }>()

const suit = computed(() => (props.card ? props.card.suit : ''))
const symbol = computed(() => (props.card ? SYMBOLS[props.card.suit] : ''))

const label = computed(() => {
  if (!props.card) return 'Draw a card'
  return `${props.card.value} of ${SUIT_NAMES[props.card.suit]}. Draw again.`
})
</script>

<style scoped>
.card {
  /* Semantically a button; the UA styling is reset back to a card face. */
  appearance: none;
  background: #fff;
  font: inherit;
  display: block;
  border-color: #808080 #000000 #000000 #808080;
  border-width: 2px;
  border-style: solid;
  font-size: 20pt;
  width: 145px;
  height: 196px;
  max-width: 100%;
  cursor: pointer;
  margin-right: auto;
  margin-left: auto;
  padding: 5px;
  font-weight: bold;
  position: relative;
  /* Prevent text selection on repeated clicks */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.card:focus-visible {
  outline: 3px solid #2c3e50;
  outline-offset: 3px;
}

.value {
  position: absolute;
  top: 0;
  left: 5px;
  font-size: 2em;
}

.symbol {
  position: absolute;
  bottom: 0;
  right: 5px;
  font-size: 2em;
}

.diamond,
.heart {
  color: red;
}

.club,
.spade {
  color: #000;
}
</style>
