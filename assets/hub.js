/* Library page: renders window.BOOKS (assets/books.js) as filterable cards. */
(() => {
  'use strict';
  const books = window.BOOKS || [];
  const grid = document.querySelector('.book-grid');
  const filters = document.querySelector('.filters');
  const labels = { all: 'All', technical: 'Technical', personal: 'Personal development' };
  let active = 'all';

  const make = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  };

  function render() {
    const shown = books.filter((b) => active === 'all' || b.category === active);
    grid.replaceChildren(...shown.map((b) => {
      const card = make('a', 'book');
      card.href = b.href;
      card.append(
        make('div', 'kicker', labels[b.category] || b.category),
        make('h2', '', b.title),
        make('div', 'author', b.author),
        make('p', 'summary', b.summary),
      );
      if (b.tags && b.tags.length) {
        const tags = make('div', 'tags');
        b.tags.forEach((t) => tags.append(make('span', 'tag', t)));
        card.append(tags);
      }
      return card;
    }));
    if (!shown.length) grid.append(make('p', 'empty', 'No decks in this category yet.'));
  }

  Object.keys(labels).forEach((key) => {
    const chip = make('button', 'chip', labels[key]);
    chip.setAttribute('aria-pressed', String(key === active));
    chip.addEventListener('click', () => {
      active = key;
      filters.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      render();
    });
    filters.append(chip);
  });

  render();
})();
