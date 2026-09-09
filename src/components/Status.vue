<template>
  <div class="status-panel">
    <div v-if="gameStatus !== 'start'" class="status">"{{ currentValue }}"!</div>
    <div v-else>Click the card to begin...</div>

    <div v-if="gameStatus === 'playing'" class="playing">
      <p>{{ drawn }} down, {{ remaining }} to go....</p>
    </div>
    <div v-else-if="gameStatus === 'lose'" class="lose">
      <p>You lost with {{ remaining }} to go!</p>
      <div class="restart">Try Again?</div>
    </div>
    <div v-else-if="gameStatus === 'win'" class="win">
      <p>Holy crap, you won!</p>
      <div class="restart">Try Again?</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Status',

  props: {
    currentValue: { type: String, required: true },
    gameStatus: { type: String, required: true },
    drawn: { type: Number, required: true },
    remaining: { type: Number, required: true }
  }
}
</script>

<style scoped>
/* Fixed height so the card does not jump when the message changes. */
.status-panel {
  font-weight: bold;
  height: 6em;
}

.status {
  font-size: 2em;
  text-transform: uppercase;
}

.win,
.lose {
  font-size: 5em;
  line-height: 0.9em;
  color: green;
  background-color: rgba(10, 10, 20, 0.1);
  padding: 5px;
}

.lose {
  color: red;
}

.restart {
  font-size: 0.5em;
}
</style>
