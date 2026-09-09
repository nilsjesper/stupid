# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page Vue 3 app for the card game "Stupid" (page title: "Get Stupid").
No backend, no router, no state library, no runtime dependencies beyond Vue.

## Commands

```bash
npm install
npm run dev          # Vite dev server + HMR at localhost:5173
npm run build        # production bundle into dist/
npm run preview      # serve the built dist/
npm test             # vitest, single run
npm run test:watch   # vitest watch mode
npm run lint         # eslint (flat config)
```

Single test file: `npx vitest run test/game.test.js`. Single test by name:
`npx vitest run -t "loses when the count matches"`.

Requires Node 20+. Verified working on Node 26 / npm 11.

## Architecture

`src/main.js` mounts `App.vue` into `#app`. All game state and rules live in
`App.vue`; the two child components are presentational and take props only.

```
App.vue          owns state: deck, countIdx, currentValue, currentCard, drawn, gameStatus
├── Status.vue   count call-out + progress/win/lose text (props only)
└── Card.vue     the drawn card; emits `draw` on click
src/deck.js      createDeck() → shuffled 52-card array
```

**Game rules** (all in `App.vue#newCard`): each click pops a card off the
shuffled deck and advances a count through the cyclic `VALUES` array
`['A','2',…,'K']`. If the count equals the drawn card's `value`, `gameStatus`
becomes `'lose'`. Emptying the deck without a collision sets `'win'`. Clicking
while won or lost calls `reset()` first, so the same click starts a new round.
`gameStatus` is the single state machine: `start` → `playing` → `win` | `lose`.

A collision on the final card is a **loss**, not a win. The pre-Vite version
checked win second and so overwrote the loss; the current order is deliberate
and `test/game.test.js` pins it.

**Conventions:**

- Cards are plain `{ value, suit }` objects. `suit` doubles as the CSS class in
  `Card.vue` (`spade`/`heart`/`diamond`/`club`), so the strings in `src/deck.js`
  and that stylesheet must stay in sync.
- `Card.vue` takes `card: null` before the first draw and renders a blank face.
  Its computed props guard for null — keep that if you add logic there.
- Child → parent communication is a real emit (`emits: ['draw']`). Do not
  reintroduce `this.$parent`.
- `Status.vue` receives `drawn` and `remaining` as plain numbers rather than the
  deck object, so it stays decoupled from how the deck is represented.
- Options API throughout. Fine to keep; there is no Composition API in the tree
  to be consistent with.
- `.status-panel` has a fixed `height: 6em` so the card does not jump when the
  message swaps between one and three lines.

## History worth knowing

This was a 2016 `vuejs-templates/webpack` scaffold (webpack 1, Vue 2, PhantomJS,
Nightwatch/Selenium) until it was migrated to Vite + Vue 3. The old stack still
compiled and ran on Node 26, but three things had rotted, all from unpinned
dependencies drifting rather than from the app code:

- `friendly-errors-webpack-plugin@^1.1.2` floated to a webpack-2-only release,
  so `npm install` needed `--legacy-peer-deps`.
- webpack 1's ES5-only UglifyJS could not parse ES6 that appeared in
  `rand-utils` (a transitive dep of `cards`, which pinned it as `"latest"`) or in
  Vue 2.7's dist.
- The PhantomJS test runner was dead, and the committed specs still asserted the
  scaffold's boilerplate rather than anything this app rendered.

The `cards` package was dropped in the migration and replaced by `src/deck.js`
(~20 lines) specifically to remove that `"latest"` transitive pin.

## Known gaps

- `Card.vue` is a clickable `<div>` with no role, `tabindex`, or key handler, so
  the game's only interaction is mouse/touch-only and invisible to screen
  readers. The accessibility tree exposes nothing but the status text.
- `static/img/card.png` is unreferenced scaffold from the old build and is not
  served — Vite serves `public/`, not `static/`. Delete it or move it if you
  ever want a card back.
