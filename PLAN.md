# Plan

## Goal

Test whether colleagues are interested in a learning and development hub, using book decks as the pilot content. Each deck should do two things: share the ideas, and show how they apply to the company. Details on the company angle to be added before the first real deck.

What "interest" could look like, so the pilot has something to measure:

- People open a deck when it is shared, and some finish it
- Someone replies, asks a question, or suggests a book
- A team asks to use a deck in a meeting or a lunch-and-learn
- Someone offers to contribute their own deck

## Phase 1: Foundation (done)

- Library page with category filter
- Deck engine: keyboard, touch and toolbar navigation, progress bar, slide overview, deep links, light/dark, print to PDF
- Components: step reveal, pop-ups, term tooltips, flip cards, tabs, collapsible detail, quiz, saved checklist, notes
- Demo deck and a template for new books

## Phase 2: First real book

- Pick the book and gather highlights (Kindle export, photos of pages, or typed notes)
- Settle a standard deck outline. Suggested:
  1. Title and why I read it
  2. The big idea in one sentence
  3. Key concepts (3 to 5, flip cards)
  4. Best highlights (quote + pop-up for context)
  5. Where I disagree or what is missing
  6. How it applies at our company (tabs: book says / where we are today / what we could try)
  7. Self-check quiz
  8. Actions
  9. "Want more of this?" closing slide with a way to respond
- Keep it short (10 to 12 slides, about 5 minutes) since the first deck is also the pitch for the hub
- Build it from `_template.html`, then adjust the template with whatever was missing

## Phase 3: Share it and gauge interest

- Decide where it lives: shared drive folder, SharePoint, or an internal static site (GitHub/GitLab Pages). All work as-is because there is no build step
- Choose the feedback channel for the closing slide. Options, simplest first:
  - A mailto or Teams/Slack link ("tell me what you think")
  - A link to a short Microsoft/Google Form: was this useful, what should come next, would you contribute
  - If hosted on a real web server: page analytics for opens and completion
- Share with a small group first, collect reactions, then widen
- Put the folder under git for history
- Add company colours and logo if wanted (tokens at the top of `assets/styles.css`)
- Decide go / no-go on a wider hub from the responses

## Phase 4: More interactivity (pick as needed)

Ordered roughly by value for book notes against effort.

| Idea | What it does | Effort |
| --- | --- | --- |
| Clickable diagram hotspots | Numbered dots on a framework image or SVG; each opens a pop-up. Good for models like a 2x2 matrix or a process loop | Low |
| Chapter map / timeline | A horizontal strip of chapters; click one to jump to its slides | Low |
| Sort or match exercise | Drag items into the right bucket (e.g. "urgent vs important") | Medium |
| Self-rating sliders | "How well do I do this today?" 1 to 5 per habit, saved, shown as a small radar or bar chart | Medium |
| Reflection boxes | Free-text prompts ("Where did I see this last week?") saved in the browser, exportable as text | Low |
| Review mode | Collects every flip card and quiz across all decks into one shuffled revision session | Medium |
| Spaced repetition | Review mode that resurfaces cards after 1, 3, 7, 30 days | Medium |
| Before / after slider | Drag a divider across two versions of code, a design or a process | Low |
| Highlight gallery | All quotes from all books on one searchable page, filterable by tag | Medium |
| Library search and tags | Search titles, tags and slide text from the library page | Low |
| Live code samples | Editable snippet with a Run button, for technical books | Medium |
| Presenter view | Second window with notes, next slide and a timer | Medium |
| Team polls and comments | Colleagues vote or comment on a slide. Needs a shared backend, so only if the hub is hosted | High |

## Phase 5: If the format outgrows slides

- Scrolling article layout from the same content (slides become sections)
- Write notes in Markdown and generate the HTML with a small script
- One-page summary card per book for printing
