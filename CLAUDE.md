# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page Vue 3 + TypeScript app for the card game "Stupid" (page title:
"Get Stupid"). No backend, no router, no state library, and no runtime
dependency other than Vue.

## Commands

```bash
npm ci               # install from the lockfile (what CI runs)
npm run dev          # Vite dev server + HMR at localhost:5173
npm run build        # production bundle into dist/
npm run preview      # serve the built dist/
npm test             # vitest, single run
npm run test:watch   # vitest watch mode
npm run typecheck    # vue-tsc --noEmit
npm run lint         # eslint (flat config)
```

Single test file: `npx vitest run test/game.test.ts`. Single test by name:
`npx vitest run -t "loses when the count matches"`.

Node 22 is pinned in `.nvmrc`; the `engines` floor is 20. Verified on Node 26.

## Architecture

`src/main.ts` mounts `App.vue` into `#app`. All game state and rules live in
`App.vue`; the two child components are presentational and take props only.
Every component uses `<script setup lang="ts">`.

```
App.vue          owns state: deck, countIdx, currentValue, currentCard, drawn, gameStatus
├── Status.vue   count call-out + progress/win/lose text; the aria-live region
└── Card.vue     the drawn card; a <button> that emits `draw`
src/deck.ts      createDeck() → shuffled Card[]; Suit/CardValue/Card types
src/types.ts     GameStatus union
```

**Game rules** (all in `App.vue#newCard`): each click pops a card off the
shuffled deck and advances a count through the cyclic `VALUES` array
`['A','2',…,'K']`. If the count equals the drawn card's `value`, `gameStatus`
becomes `'lose'`. Emptying the deck without a collision sets `'win'`. Clicking
while won or lost calls `reset()` first, so the same click starts a new round.

A collision on the final card is a **loss**, not a win. The pre-Vite version
checked win second and so overwrote the loss; the current order is deliberate
and `test/game.test.ts` pins it.

**Conventions:**

- `SUITS`/`VALUES` in `src/deck.ts` are `as const`, so `Suit` and `CardValue`
  are derived unions rather than loose strings. `Suit` also doubles as the CSS
  class in `Card.vue` and keys its `SYMBOLS`/`SUIT_NAMES` maps, so adding a suit
  is a type error until every map is updated — that coupling is intentional.
- `gameStatus` is typed `GameStatus`, which is the state machine:
  `start` → `playing` → `win` | `lose`.
- `Card.vue` takes `card: null` before the first draw and renders a blank face.
  Its computed props guard for null — keep that if you add logic there.
- Child → parent communication is a real emit (`defineEmits<{ draw: [] }>()`).
  Do not reintroduce `this.$parent`.
- `Status.vue` receives `drawn` and `remaining` as plain numbers rather than the
  deck object, so it stays decoupled from how the deck is represented.
- Tests assert against rendered DOM, never `wrapper.vm`. `<script setup>` does
  not expose internals, and `defineExpose` purely for tests is not worth it.
- `.status-panel` uses `min-height`, not `height`. A fixed height made the large
  win/lose text overflow onto the card on narrow screens.

## Accessibility

The card is a real `<button>`, so Enter and Space work with no key handlers, and
it carries a state-dependent `aria-label` ("Draw a card" → "Q of hearts. Draw
again.") because suit is otherwise conveyed only by glyph and colour. The suit
glyph is `aria-hidden`. `Status.vue` is `role="status" aria-live="polite"` and
carries a visually-hidden `Count: Q` phrasing, since `"Q"!` reads poorly aloud.
Specs in `test/components.test.ts` cover all of this — keep them passing.

## Dependency pinning (read before bumping anything)

The 2016 version of this repo broke for one reason: **unpinned ranges with no
lockfile.** `friendly-errors-webpack-plugin@^1.1.2` floated to a webpack-2-only
release, and `cards` pinned `rand-utils` to `"latest"`, which eventually shipped
ES6 that webpack 1's UglifyJS could not parse. The lockfile is committed and CI
uses `npm ci` specifically so this cannot recur.

**`typescript` is held at `^5.9.3` on purpose.** `vue-tsc` declares an
open-ended peer of `typescript: ">=5.0.0"` but its code assumes the TypeScript 5
package layout, so npm resolving TypeScript 7 breaks `npm run typecheck` with
`ERR_PACKAGE_PATH_NOT_EXPORTED` on `./lib/tsc`. `.github/dependabot.yml` ignores
TypeScript majors for this reason. Revisit when vue-tsc supports TS 7.

## CI

`.github/workflows/ci.yml` runs `npm ci`, lint, typecheck, test and build. It
triggers on `pull_request` and is also a reusable `workflow_call`, so the check
steps are defined in exactly one place.

`.github/workflows/deploy.yml` publishes `dist/` to GitHub Pages on pushes to
`master`, but only after calling `ci.yml` as a gating `check` job — a commit
that fails a test or `vue-tsc` must never reach the public URL. `base: './'` in
the Vite config keeps asset paths relative so the build works from a Pages
subpath.

Note the deliberate absence of a `push` trigger on `ci.yml`: with both a
wildcard `push` and `pull_request`, every same-repo PR ran the whole matrix
twice. CI signal for a branch now comes from its PR.

## Known gaps

`static/img/card.png` is unreferenced scaffold from the old build and is not
served — Vite serves `public/`, not `static/`. Delete it or move it if you ever
want a card back.
