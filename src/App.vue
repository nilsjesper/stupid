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

<script>
import Status from './components/Status.vue'
import Card from './components/Card.vue'
import { createDeck, VALUES } from './deck.js'

export default {
  name: 'App',

  components: { Status, Card },

  data () {
    return {
      deck: [],
      countIdx: -1,
      currentValue: '',
      currentCard: null,
      drawn: 0,
      gameStatus: 'start'
    }
  },

  computed: {
    remaining () {
      return this.deck.length
    }
  },

  created () {
    this.reset()
  },

  methods: {
    // One click = one draw. The spoken count cycles A..K forever; if it lands
    // on the value you just drew, you lose. Empty the deck without a collision
    // and you win.
    newCard () {
      if (this.gameStatus === 'win' || this.gameStatus === 'lose') {
        this.reset()
      }

      this.gameStatus = 'playing'
      this.currentCard = this.deck.pop()
      this.drawn++

      this.countIdx = (this.countIdx + 1) % VALUES.length
      this.currentValue = VALUES[this.countIdx]

      // A collision on the final card is still a loss. The pre-Vite version
      // checked win second and so overwrote the loss with a win.
      if (this.currentValue === this.currentCard.value) {
        this.gameStatus = 'lose'
      } else if (this.deck.length === 0) {
        this.gameStatus = 'win'
      }
    },

    reset () {
      this.deck = createDeck()
      this.countIdx = -1
      this.currentValue = ''
      this.currentCard = null
      this.drawn = 0
    }
  }
}
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
