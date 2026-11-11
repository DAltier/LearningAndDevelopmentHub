/* Learning & Development Hub — deck engine.
   Plain script (no modules, no fetch) so decks open straight from file://.
   Everything is driven by HTML classes / data attributes; see README.md. */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const el = (tag, cls, html) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html) node.innerHTML = html;
    return node;
  };
  // localStorage can throw (private windows, blocked site data) — never let it break a deck.
  const store = {
    get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ } },
  };

  /* ---------- Theme (shared with the library page) ---------- */
  const root = document.documentElement;
  const savedTheme = store.get('ldhub:theme');
  if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;

  function toggleTheme() {
    const isDark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = isDark ? 'light' : 'dark';
    store.set('ldhub:theme', root.dataset.theme);
  }

  const deck = $('.deck');
  if (!deck) {
    // Library page: only the theme toggle is needed.
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-action="theme"]')) toggleTheme();
    });
    return;
  }

  /* ---------- Deck state ---------- */
  const slides = $$('.slide', deck);
  const pageKey = 'ldhub:' + decodeURIComponent(location.pathname.split('/').pop() || 'deck');
  let current = 0;

  /* ---------- Chrome: progress bar, toolbar, notes panel, dialogs ---------- */
  const progress = el('div', 'progress', '<span></span>');
  const bar = el('nav', 'bar', `
    <a href="${deck.dataset.home || '../index.html'}" title="Back to the library">&larr; Library</a>
    <span class="spacer"></span>
    <button class="nav" data-action="prev" title="Previous (&larr;)" aria-label="Previous">&lsaquo;</button>
    <button class="count" data-action="overview" title="All slides (O)"></button>
    <button class="nav" data-action="next" title="Next (&rarr; or Space)" aria-label="Next">&rsaquo;</button>
    <span class="spacer"></span>
    <button class="wide" data-action="notes" title="My notes (N)">Notes</button>
    <button data-action="theme" title="Light / dark (T)">Theme</button>
    <button class="wide" data-action="fullscreen" title="Full screen (F)">Full screen</button>`);
  bar.setAttribute('aria-label', 'Presentation controls');
  const notesPanel = el('aside', 'notes-panel');
  const popup = el('dialog', 'popup',
    '<div class="popup-inner"><button class="popup-close" aria-label="Close">&times;</button><div class="popup-body"></div></div>');
  document.body.append(progress, bar, notesPanel, popup);

  const count = $('.count', bar);
  const popupBody = $('.popup-body', popup);

  function openDialog(content) {
    popupBody.replaceChildren(content);
    if (!popup.open) popup.showModal();
  }
  popup.addEventListener('click', (e) => {
    // A click on the <dialog> element itself is a click on the backdrop.
    if (e.target === popup || e.target.closest('.popup-close')) popup.close();
  });

  /* ---------- Navigation ---------- */
  const slideTitle = (s, i) =>
    s.dataset.title || ($('h1, h2', s) || {}).textContent || `Slide ${i + 1}`;

  // stepsShown: true = reveal all steps (arriving backwards), false = hide all, undefined = leave as is.
  function show(index, stepsShown) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
    const slide = slides[current];
    if (stepsShown !== undefined) {
      $$('.step', slide).forEach((st) => st.classList.toggle('shown', stepsShown));
    }
    slide.scrollTop = 0;
    count.textContent = `${current + 1} / ${slides.length}`;
    $('span', progress).style.width = `${((current + 1) / slides.length) * 100}%`;
    const notes = $('.notes', slide);
    notesPanel.innerHTML = notes ? notes.innerHTML : '<em>No notes for this slide.</em>';
    try { history.replaceState(null, '', `#${current + 1}`); } catch { /* ignore */ }
  }

  function next() {
    const hidden = $('.step:not(.shown)', slides[current]);
    if (hidden) { hidden.classList.add('shown'); return; }
    if (current < slides.length - 1) show(current + 1, false);
  }

  function prev() {
    const shown = $$('.step.shown', slides[current]);
    if (shown.length) { shown[shown.length - 1].classList.remove('shown'); return; }
    if (current > 0) show(current - 1, true);
  }

  function openOverview() {
    const list = el('ol', 'overview-list');
    slides.forEach((s, i) => {
      const li = el('li');
      const btn = el('button');
      btn.dataset.goto = i;
      if (i === current) btn.setAttribute('aria-current', 'true');
      const n = el('span', 'n'); n.textContent = i + 1;
      const t = el('span'); t.textContent = slideTitle(s, i);
      btn.append(n, t);
      li.append(btn);
      list.append(li);
    });
    const frag = document.createDocumentFragment();
    const h = el('h3'); h.textContent = 'All slides';
    frag.append(h, list);
    openDialog(frag);
  }

  const actions = {
    next,
    prev,
    overview: openOverview,
    theme: toggleTheme,
    notes: () => document.body.classList.toggle('show-notes'),
    fullscreen: () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (root.requestFullscreen) root.requestFullscreen().catch(() => {});
    },
  };

  /* ---------- Component setup ---------- */
  // Popup triggers that aren't real buttons still need to be keyboard reachable.
  $$('[data-popup]').forEach((t) => {
    if (t.tagName === 'BUTTON' || t.tagName === 'A') return;
    t.setAttribute('role', 'button');
    t.tabIndex = 0;
    t.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t.click(); }
    });
  });

  $$('.term').forEach((t) => { t.tabIndex = 0; });
  $$('.flip').forEach((f) => f.setAttribute('aria-pressed', 'false'));

  // Tabs: <div class="tabs"><section data-tab="Label">…</section>…</div>
  $$('.tabs').forEach((tabs) => {
    const panels = $$(':scope > section', tabs);
    const tabBar = el('div', 'tabs-bar');
    tabBar.setAttribute('role', 'tablist');
    panels.forEach((panel, i) => {
      const btn = el('button');
      btn.textContent = panel.dataset.tab || `Tab ${i + 1}`;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(i === 0));
      btn.addEventListener('click', () => {
        panels.forEach((p, j) => { p.hidden = j !== i; });
        $$('button', tabBar).forEach((b, j) => b.setAttribute('aria-selected', String(j === i)));
      });
      panel.hidden = i !== 0;
      tabBar.append(btn);
    });
    tabs.prepend(tabBar);
  });

  // Action checklists: <ul class="actions" data-key="optional-name"><li>…</li></ul>
  $$('.actions').forEach((list, listIndex) => {
    const key = `${pageKey}:actions:${list.dataset.key || listIndex}`;
    const state = store.get(key) || {};
    $$(':scope > li', list).forEach((li, i) => {
      const label = el('label');
      const box = el('input');
      box.type = 'checkbox';
      box.checked = Boolean(state[i]);
      box.addEventListener('change', () => { state[i] = box.checked; store.set(key, state); });
      const text = el('span');
      text.append(...li.childNodes);
      label.append(box, text);
      li.append(label);
    });
  });

  /* ---------- Clicks (delegated) ---------- */
  document.addEventListener('click', (e) => {
    const goto = e.target.closest('[data-goto]');
    if (goto) { popup.close(); show(Number(goto.dataset.goto), false); return; }

    const action = e.target.closest('[data-action]');
    if (action && actions[action.dataset.action]) { actions[action.dataset.action](); return; }

    const trigger = e.target.closest('[data-popup]');
    if (trigger) {
      const source = document.getElementById(trigger.dataset.popup);
      if (source) openDialog((source.content || source).cloneNode(true));
      return;
    }

    const flip = e.target.closest('.flip');
    if (flip) { flip.setAttribute('aria-pressed', String(flip.getAttribute('aria-pressed') !== 'true')); return; }

    // Quiz: wrong answers get crossed out and you can try again; the right one reveals the explanation.
    const opt = e.target.closest('.quiz .opt');
    if (opt) {
      const quiz = opt.closest('.quiz');
      if (quiz.classList.contains('answered') || opt.classList.contains('wrong')) return;
      if (opt.hasAttribute('data-correct')) { opt.classList.add('correct'); quiz.classList.add('answered'); }
      else opt.classList.add('wrong');
    }
  });

  /* ---------- Keyboard ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if ($('dialog[open]')) return; // let the dialog own the keyboard
    const t = e.target;
    const tag = t.tagName;
    const isToggle = tag === 'INPUT' && (t.type === 'checkbox' || t.type === 'radio');
    if ((tag === 'INPUT' && !isToggle) || tag === 'TEXTAREA' || tag === 'SELECT' || t.isContentEditable) return;
    const onControl = isToggle || tag === 'BUTTON' || tag === 'A' || tag === 'SUMMARY' || t.getAttribute('role') === 'button';

    switch (e.key) {
      case 'ArrowRight': case 'PageDown': next(); break;
      case 'ArrowLeft': case 'PageUp': prev(); break;
      case ' ': case 'Enter':
        if (onControl) return; // let the focused control handle it
        next();
        break;
      case 'Home': show(0, false); break;
      case 'End': show(slides.length - 1, true); break;
      case 'o': case 'O': openOverview(); break;
      case 'n': case 'N': actions.notes(); break;
      case 't': case 'T': toggleTheme(); break;
      case 'f': case 'F': actions.fullscreen(); break;
      default: return;
    }
    e.preventDefault();
  });

  /* ---------- Touch swipe ---------- */
  let touch = null;
  deck.addEventListener('touchstart', (e) => {
    const p = e.changedTouches[0];
    touch = { x: p.clientX, y: p.clientY };
  }, { passive: true });
  deck.addEventListener('touchend', (e) => {
    if (!touch) return;
    const p = e.changedTouches[0];
    const dx = p.clientX - touch.x;
    const dy = p.clientY - touch.y;
    touch = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > 2 * Math.abs(dy)) (dx < 0 ? next : prev)();
  }, { passive: true });

  /* ---------- Start ---------- */
  const fromHash = () => (parseInt(location.hash.slice(1), 10) || 1) - 1;
  window.addEventListener('hashchange', () => { if (fromHash() !== current) show(fromHash(), false); });
  show(fromHash(), false);
})();
