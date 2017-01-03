<template>
  <div id="app">
    <hello :current-value="currentValue" :game-status="gameStatus" :deck="deck"></hello>
    <card v-on:click="newCard" :picked-card="currentCard"></card>
  </div>
</template>

<script>
// get our components
import Hello from './components/Hello'
import Card from './components/Card'
import Picker from './components/Picker'

// generating a deck
const cards = require('cards')
const deck = new cards.PokerDeck()

// Shuffle the deck
deck.shuffleAll()

export default {
  name: 'stupid',
  components: {
    Hello,
    Card,
    Picker
  },
  data () {
    return {
      currentIdx: -1,
      currentValue: '',
      cardOrder: cardOrder,
      deck: deck,
      currentCard: '',
      gameStatus: 'start'
    }
  },
  methods: {
    newCard: function () {
      // If they've hit an endpoint, reshuffle & restart.
      if (this.gameStatus === 'win' || this.gameStatus === 'lose') {
        this.reset()
      }

      this.gameStatus = 'playing'
      this.currentCard = deck.draw()
      this.setCount()
      this.checkSame()

      // check to see if they've drawn the last card!
      if (deck.deck.length === 0) {
        this.gameStatus = 'win'
      }
      return true
    },
    setCount: function () {
      if (this.currentIdx === cardOrder.length - 1) {
        this.currentIdx = 0
      } else {
        this.currentIdx++
      }
      this.currentValue = cardOrder[this.currentIdx]
    },
    checkSame: function () {
      if (this.currentValue === this.currentCard.value) {
        this.gameStatus = 'lose'
      }
    },
    reset: function () {
      this.deck.shuffleAll()
      this.currentValue = ''
      this.currentIdx = -1
    }

  }
}

const cardOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size:16px;
}

</style>
