<template>
  <div class="card" :class="suit" @click="$emit('draw')">
    <div v-if="card" class="value">{{ card.value }}</div>
    <div v-if="card" class="symbol">{{ symbol }}</div>
  </div>
</template>

<script>
const SYMBOLS = {
  diamond: '♦️',
  heart: '♥︎',
  club: '♣️',
  spade: '♠️'
}

export default {
  name: 'Card',

  props: {
    // null before the first draw, which renders a blank card face.
    card: {
      type: Object,
      default: null
    }
  },

  emits: ['draw'],

  computed: {
    suit () {
      return this.card ? this.card.suit : ''
    },

    symbol () {
      return this.card ? SYMBOLS[this.card.suit] : ''
    }
  }
}
</script>

<style scoped>
.card {
  border-color: #808080 #000000 #000000 #808080;
  border-width: 2px;
  border-style: solid;
  font-size: 20pt;
  width: 145px;
  height: 196px;
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
