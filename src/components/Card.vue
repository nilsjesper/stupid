<template>
  <div
    class="card"
    v-on:click.stop="increment"
    v-bind:class="cardStyle"
  >
    <div v-if="pickedCard" class="value">{{ pickedCard.value }}</div>
    <div class="symbol">{{ cardSymbol }}</div>
  </div>
 </template>

<script>
  export default {
    name: 'card',
    props: ['picked-card'],
    methods: {
      increment: function () {
        this.$parent.newCard()
      }
    },
    computed: {
      cardStyle: function () {
        return this.pickedCard.suit
      },
      cardSymbol: function () {
        return cardSymbols[this.pickedCard.suit]
      }
    }
  }

  const cardSymbols = {
    'diamond': '♦️',
    'heart': '♥︎',
    'club': '♣️',
    'spade': '♠️'
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
  border-color: #808080 #000000 #000000 #808080;
  border-width: 2px;
  border-style: solid;
  font-size: 20pt;
  width:  145px;
  height: 196px;
  cursor:pointer;
  margin-right:auto;
  margin-left:auto;
  padding:5px;
  font-weight:bold;
  position:relative;
  /* Prevent text selection on click */
  -webkit-user-select: none; /* webkit (safari, chrome) browsers */
  -moz-user-select: none; /* mozilla browsers */
  -khtml-user-select: none; /* webkit (konqueror) browsers */
  -ms-user-select: none; /* IE10+ */
}

.value {
  position:absolute;
  top:0px;
  left:5px;
  font-size:2em;
 }

.symbol {
  position:absolute;
  bottom:0px;
  right:5px;
  font-size:2em;
}

.diamond, .heart {
  color:red;
}

.club, .spade {
  color:#000;  
}



</style>
