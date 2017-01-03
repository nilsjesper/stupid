<template>
  <div class="counter">
      <div v-if="gameStatus != 'start'"class="status">
        "{{ currentValue }}"!
      </div>
    <div v-if="gameStatus == 'playing'" class="playing">
      <p>{{ deck.held.length }} down, {{ deck.deck.length}} to go....</p>
    </div>
    <div v-else-if="gameStatus == 'lose'" class="lose">
      <p>You lost with {{ deck.deck.length}} to go!</p>
      <div class="restart">Try Again?</div>
    </div>
    <div v-else-if="gameStatus == 'win'" class="win">
      <p>Holy crap, you won!</p>
      <div class="restart">Try Again?</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'counter',
  props: ['current-value', 'game-status', 'deck']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.counter {
  font-weight:bold;
  height:6em;
}
.status {
  font-size:2em;
  text-transform: uppercase;
}
.win, .lose{
  font-size: 5em;
  line-height:.9em;
  color:green;
  background-color:rgba(10, 10, 20, 0.1);
  padding:5px;
}
.lose {
  color:red;
}
.restart {
  font-size:.5em;
}
</style>
