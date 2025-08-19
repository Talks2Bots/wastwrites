document.addEventListener('DOMContentLoaded', function() {
  // Keyed per-post by H1 or path
  const storyKey = (document.querySelector('h1')?.textContent?.trim() || location.pathname).toLowerCase().replace(/\s+/g,'-');

  // 1) COUNTERFACTUAL PROMPTS
  const cfkPrompts = {
    small: [
      "If the juice ran out for a week, what happens to the shows?",
      "If Emily skipped one summons, what would the hosts do next?"
    ],
    big: [
      "If the hosts spoke one sentence to Emily, what should it be?",
      "If Nick refused forever, what would it cost Emily to stay?"
    ],
    invert: [
      "If Emily led a strike that worked, what replaces the bowl?",
      "If the hosts asked for silence instead of dance, what would she make?"
    ]
  };

  // 2) LENS PROMPTS
  const lensPrompts = {
    alien: "What do the hosts gain by never speaking?",
    hospital: "What do machines gain by never asking permission?"
  };

  // helpers
  const $ = s => document.querySelector(s);
  const saveNote = (kind, prompt, text) => {
    const key = 'linger_' + storyKey;
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    saved.push({ kind, prompt, text, ts: Date.now() });
    localStorage.setItem(key, JSON.stringify(saved));
    renderNotes();
  };
  const renderNotes = () => {
    const key = 'linger_' + storyKey;
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    const ul = $('#linger-notes');
    if (!ul) return;
    ul.innerHTML = list.slice().reverse().map(n =>
      `<li><strong>${n.kind}</strong> — <em>${n.prompt}</em><br>${n.text}</li>`
    ).join('') || '<li><em>No notes yet.</em></li>';
  };

  // COUNTERFACTUAL knob
  let currentStop = 'small';
  const setCFK = (stop, randomize=false) => {
    currentStop = stop;
    document.querySelectorAll('.cfk-knob [role="tab"]').forEach(b => {
      b.setAttribute('aria-selected', b.dataset.stop === stop ? 'true' : 'false');
    });
    const list = cfkPrompts[stop] || ["What changes first, and what is the price?"];
    $('#cfk-prompt').textContent = randomize ? list[Math.floor(Math.random()*list.length)] : list[0];
    $('#cfk-status').textContent = '';
    $('#cfk-input').value = '';
  };
  document.querySelector('.cfk-knob')?.addEventListener('click', e => {
    const b = e.target.closest('button[role="tab"]'); if (!b) return;
    setCFK(b.dataset.stop);
  });
  $('#cfk-shuffle')?.addEventListener('click', () => setCFK(currentStop, true));
  $('#cfk-save')?.addEventListener('click', () => {
    const val = $('#cfk-input').value.trim();
    if (!val) { $('#cfk-status').textContent = 'type a line first'; return; }
    saveNote('what if…', $('#cfk-prompt').textContent, val);
    $('#cfk-status').textContent = 'saved locally';
  });

  // LENSES
  let currentLens = 'alien';
  const setLens = (lens) => {
    currentLens = lens;
    document.querySelectorAll('.lens-toggle [role="tab"]').forEach(b => {
      b.setAttribute('aria-selected', b.dataset.lens === lens ? 'true' : 'false');
    });
    $('#lens-prompt').textContent = lensPrompts[lens] || '';
    $('#lens-status').textContent = '';
    $('#lens-input').value = '';
  };
  document.querySelector('.lens-toggle')?.addEventListener('click', e => {
    const b = e.target.closest('button[role="tab"]'); if (!b) return;
    setLens(b.dataset.lens);
  });
  $('#lens-save')?.addEventListener('click', () => {
    const val = $('#lens-input').value.trim();
    if (!val) { $('#lens-status').textContent = 'type a line first'; return; }
    saveNote('read it as… ' + currentLens, $('#lens-prompt').textContent, val);
    $('#lens-status').textContent = 'saved locally';
  });

  // TEN WORDS
  const tenInput = $('#ten-input');
  const countWords = s => (s.trim() ? s.trim().split(/\s+/).length : 0);
  const updateCount = () => $('#ten-count').textContent = `${countWords(tenInput.value)}/10 words`;
  tenInput?.addEventListener('input', updateCount);
  $('#ten-save')?.addEventListener('click', () => {
    const text = tenInput.value.trim();
    const words = countWords(text);
    if (words === 0) { $('#ten-status').textContent = 'type your ten words'; return; }
    if (words > 10) { $('#ten-status').textContent = 'keep it to ten words'; return; }
    saveNote('ten words', 'Write the next ten words.', text);
    $('#ten-status').textContent = 'saved locally';
    tenInput.value = ''; updateCount();
  });

  // init
  setCFK('small');
  setLens('alien');
  updateCount();
  renderNotes();
});

