# Learning & Development Hub

Interactive HTML decks of notes and highlights from books (technical and personal development).

Plain HTML, CSS and JavaScript. No install, no build, no internet needed: double-click `index.html`.

## Layout

```
index.html                      Library page listing every deck
assets/
  styles.css                    Theme + all component styles (light and dark)
  deck.js                       Deck engine: navigation, pop-ups, quizzes, ...
  hub.js                        Renders the library cards
  books.js                      The catalogue: one entry per deck
presentations/
  getting-started.html          Demo deck showing every component
  _template.html                Skeleton to copy for a new book
PLAN.md                         Roadmap and ideas
```

## Add a book

1. Copy `presentations/_template.html` to `presentations/<book-name>.html`.
2. Write the slides. Each slide is a `<section class="slide">`.
3. Add an entry to `assets/books.js` so it appears in the library.

## Components

Copy working examples from `presentations/getting-started.html`.

| Want | Write |
| --- | --- |
| Reveal on next key press | `class="step"` on any element |
| Pop-up with more detail | `<button class="more" data-popup="ID">` plus `<template id="ID">…</template>` |
| Pop-up from any phrase | `<span data-popup="ID">phrase</span>` |
| Hover/tap definition | `<span class="term" data-def="Definition">term</span>` |
| Flip card | `<button class="flip"><span class="flip-front">…</span><span class="flip-back">…</span></button>` inside `<div class="cards">` |
| Tabs | `<div class="tabs"><section data-tab="Label">…</section>…</div>` |
| Collapsible detail | `<details class="deeper"><summary>Title</summary>…</details>` |
| Quiz | `<div class="quiz">` with `<button class="opt">` options, `data-correct` on the right one, and a `<p class="quiz-why">` explanation |
| Checklist that remembers ticks | `<ul class="actions"><li>…</li></ul>` |
| Pull quote | `<blockquote class="quote">… <cite>source</cite></blockquote>` |
| Private notes | `<aside class="notes">…</aside>` inside the slide |
| Two columns | `<div class="cols">` |

## Shortcuts

`→` / `Space` next · `←` back · `Home` / `End` · `O` all slides · `N` notes · `T` theme · `F` full screen · `Ctrl+P` print to PDF.

The URL tracks the slide (`deck.html#4`), so a single slide can be linked.

## Per-book colour

Add this to a deck's `<head>`, after the stylesheet link:

```html
<style>:root { --accent: #2f6f8f; --accent-soft: #d9e8ef; }</style>
```
