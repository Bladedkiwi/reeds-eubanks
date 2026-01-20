/**
 * Bassoon Reed – App JS (Export Build with Navigation History)
 * - Single init path (DOMContentLoaded) + per-renderer once guards
 * - Figures & subsection media rendered into fig-grid containers (idempotent)
 * - Navigation history: "Back" returns to the last visited test, not numeric-previous
 */

// === Tabs order (Intro + PT + T01...T20) ===
const testsOrder = ['Intro','PT','T01','T02','T03','T04','T05','T06','T07','T08','T09','T10','T11','T12','T13','T14','T15','T16','T17','T18','T19','T20'];

// === Navigation state ===
let currentTest = null;             // currently open test id
const navHistory = [];              // stack of visited test ids (push previous on each forward nav)

// === Navigation & UI helpers ===
window.openTest = function(id, opts = { fromUser: true }) {
  const fromUser = opts && opts.fromUser !== undefined ? opts.fromUser : true;

  // Record history: push the test we are leaving only on user-initiated navigation
  if (fromUser && currentTest && currentTest !== id) {
    navHistory.push(currentTest);
  }

  // Tabs
  testsOrder.forEach(tid => {
    const tab = document.getElementById('tab-' + tid);
    if (tab) tab.classList.toggle('active', tid === id);
  });
  // Sections
  testsOrder.forEach(tid => {
    const section = document.getElementById(tid);
    if (section) section.classList.toggle('show', tid === id);
  });
  const content = document.getElementById('content');
  if (content) content.scrollTop = 0;

  // Update current
  currentTest = id;
};

window.nextTest = function(current) {
  // Forward navigation should also record history
  const idx = testsOrder.indexOf(current);
  if (idx >= 0 && idx < testsOrder.length - 1) openTest(testsOrder[idx + 1], { fromUser: true });
  else alert('You have reached the final test.');
};

window.prevTest = function(current) {
  // Prefer history stack (last visited), else fallback to numeric previous
  if (navHistory.length > 0) {
    const prevId = navHistory.pop();
    // Back navigation should NOT push current onto history again
    openTest(prevId, { fromUser: false });
    return;
  }
  const idx = testsOrder.indexOf(current);
  if (idx > 0) openTest(testsOrder[idx - 1], { fromUser: false });
  else alert('You are at the beginning.');
};

window.toggleDetails = function(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const showing = el.classList.contains('show');
  el.classList.toggle('show', !showing);
  if (!showing) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

window.goToRef = function(fromId, refId) {
  // Cross-reference jumps are user-initiated and should record history
  openTest(refId, { fromUser: true });
};

window.filterTabs = function() {
  const q = (document.getElementById('search')?.value || '').toLowerCase();
  testsOrder.forEach(tid => {
    const tab = document.getElementById('tab-' + tid);
    if (tab) tab.style.display = tab.textContent.toLowerCase().includes(q) ? 'block' : 'none';
  });
};


// Close the modal (and clean up listeners)
function closeFigModal() {
  const m = document.getElementById('figModal');
  const img = document.getElementById('figModalImg');
  if (!m) return;
  m.classList.remove('show');
  m.setAttribute('aria-hidden', 'true');
  document.removeEventListener('keydown', escHandler);
  // Optional: free memory on mobile by clearing src
  if (img) img.src = '';
}

// ESC key handler
function escHandler(e) {
  if (e.key === 'Escape') closeFigModal();
}

// Open the modal and wire up closing on overlay click + ESC
window.openFig = function(src, caption) {
  const m = document.getElementById('figModal');
  const img = document.getElementById('figModalImg');
  if (!m || !img) return;

  // Set image and show modal
  img.src = src;
  img.alt = caption || '';
  m.classList.add('show');
  m.setAttribute('aria-hidden', 'false');

  // Close when clicking the overlay (i.e., anywhere outside the image)
  const overlayClickToClose = (ev) => {
    // Only close if the click landed on the modal backdrop, not the img
    if (ev.target === m) closeFigModal();
  };
  // Use {once:true} so this listener auto-removes on first close
  m.addEventListener('click', overlayClickToClose, { once: true });

  // ESC to close
  document.addEventListener('keydown', escHandler);
};

// === FIGURES (bottom-of-card) ===
const masterFigures = {
  'A':  { src: 'img/fig-A.png',  caption: 'Figure A: Channel taper / secondary tuning points' },
  'B':  { src: 'img/fig-B.png',  caption: 'Figure B: Rail zones & general pitch raising' },
  '1A': { src: 'img/fig-1A.png', caption: 'Figure 1A: Narrowing shape & rail thickness near tip' },
  '1D': { src: 'img/fig-1D.png', caption: 'Figure 1D: E adjustment point' },
  '1E': { src: 'img/fig-1E.png', caption: 'Figure 1E: Tip balance and taper' },
  '1F': { src: 'img/fig-1F.png', caption: 'Figure 1F: Dip behind tip correction' },
  '2A': { src: 'img/fig-2A.png', caption: 'Figure 2A: Wing taper expansion toward d' },
  '2B': { src: 'img/fig-2B.png', caption: 'Figure 2B: Corner balance (twist test) zones' },
  '3A': { src: 'img/fig-3A.png', caption: 'Figure 3A: Purple c→a zone at delta outside' },
  '3B': { src: 'img/fig-3B.png', caption: 'Figure 3B: Extended & widened c→f scrape' },
  '4A': { src: 'img/fig-4A.png', caption: 'Figure 4A: Mini channels h→i & B scrape' },
  '5A': { src: 'img/fig-5A.png', caption: 'Figure 5A: Wire cradle notches under 1st wire' },
  '5B': { src: 'img/fig-5B.png', caption: 'Figure 5B: Shoulder step t→t and back/forward scrapes' },
  '5C': { src: 'img/fig-5C.png', caption: 'Figure 5C: Target note tuning zones' },
  '16': { src: 'img/fig-16.png', caption: 'Figure 16: High-G rail zone near tip' }
};

const figuresByTest = {
  Intro: ['A'], PT: ['5A','1E','1F','A'], T01: ['1A','1D','1E','1F','A'], T02: ['2A','A'],
  T03: ['3A','3B','4A'], T04: ['4A'], T05: ['5A','5B','5C'], T06: ['5B'], T07: [], T08: ['B'],
  T09: [], T10: ['1D','2A','A'], T11: ['4A','A'], T12: ['A'], T13: ['A','B'], T14: [],
  T15: ['1E','1F','2B'], T16: ['B','16'], T17: [], T18: [], T19: ['1A'], T20: []
};

function findFigRefs(text) {
  const refs = new Set();
  const regex = /Fig\.\s*([0-9]+[A-Z]?|[A-Z])/g; // 1A, 3B, 16, A, B
  let m; while ((m = regex.exec(text)) !== null) refs.add(m[1]);
  return refs;
}

function renderFigures() {
  testsOrder.forEach(tid => {
    const article = document.getElementById(tid);
    if (!article) return;
    const card = article.querySelector('.card');
    if (!card) return;

    // Remove any existing grid to avoid duplicates, then rebuild
    const existing = card.querySelector(`#figs-${tid}`);
    if (existing) existing.remove();

    const ids = new Set([...(figuresByTest[tid] || [])]);
    const textRefs = findFigRefs(article.textContent || '');
    textRefs.forEach(id => ids.add(id));
    const valid = [...ids].filter(id => masterFigures[id]);
    if (valid.length === 0) return;

    const grid = document.createElement('div');
    grid.className = 'fig-grid';
    grid.id = `figs-${tid}`;

    const heading = document.createElement('h3');
    heading.textContent = 'Figures';
    grid.appendChild(heading);

    valid.forEach(id => {
      const f = masterFigures[id];
      const fig = document.createElement('figure');
      fig.id = `${tid}-fig-${id}`;
      fig.innerHTML = `
        <img src="${f.src}" alt="${f.caption}" loading="lazy"
             onclick="openFig('${f.src}','${f.caption}')"
             onerror="this.closest('figure').remove()">
        <figcaption>${f.caption}</figcaption>
      `;
      grid.appendChild(fig);
    });

    card.appendChild(grid);
  });
}

// === SUBSECTION MEDIA (examples & fingerings) ===
const sectionMediaMap = [
  {tid:'T01', type:'ex',  num:1,  find:{h3Text:'1.3: Stability and Articulation'}},
  {tid:'T02', type:'ex',  num:2,  find:{h3Text:'2.1: Pitch Centering on E'}},
  {tid:'T02', type:'ex',  num:3,  find:{h3Text:'2.2: Ear Plug Test for E♭ & Pitch Centering on D'}},
  {tid:'T03', type:'ex',  num:4,  find:{h3Text:'3.3: Stability'}},
  {tid:'T04', type:'ex',  num:5,  find:{h3Text:'4.1: Pitch Centering using A♭–B♭ Trill'}},
  {tid:'T04', type:'fing',num:1,  find:{h3Text:'4.1: Pitch Centering using A♭–B♭ Trill'}},
  {tid:'T04', type:'ex',  num:6,  find:{h3Text:'4.2: Pad Height / Pitch Centering: F, G, and A'}},
  {tid:'T04', type:'ex',  num:7,  find:{h3Text:'4.3: Pad Height / Pitch Centering: B♭, A♭, and F♯'}},
  {tid:'T05', type:'ex',  num:8,  find:{h3Text:'5.1: Pitch Centering'}},
  {tid:'T06', type:'ex',  num:9,  find:{h3Text:'6.1: Pitch Centering'}},
  {tid:'T07', type:'ex',  num:10, find:{h3Text:'7.1: Response to Articulation'}},
  {tid:'T07', type:'ex',  num:11, find:{blockquoteContains:'Response test'}},
  {tid:'T08', type:'fing',num:2,  find:{h3Text:'8.1: Harmonic Tuning'}},
  {tid:'T09', type:'fing',num:3,  find:{h3Text:'9.1: Harmonic Tuning'}},
  {tid:'T10', type:'fing',num:4, find:{h3Text:'10.1: Harmonic Tuning'}},
  {tid:'T11', type:'fing',num:5, find:{h3Text:'11.1: Fork B♭ Tuning'}},
  {tid:'T12', type:'fing',num:6, find:{h3Text:'12.1: Harmonic Tuning'}},
  {tid:'T12', type:'fing',num:7, find:{h3Text:'12.2: Long C♯ and D Tuning'}},
  {tid:'T13', type:'fing',num:8, find:{h3Text:'13.1: Alternate Fingering Tunings'}},
  {tid:'T14', type:'ex',  num:12, find:{h3Text:'14.1: Slurring Across Break'}},
  {tid:'T14', type:'ex',  num:13, find:{h3Text:'14.2: Slurring Minor 6ths'}},
  {tid:'T15', type:'ex',  num:14, find:{h3Text:'15.1: Clean Attack'}},
  {tid:'T15', type:'ex',  num:15, find:{h3Text:'15.2: Rapid, Clear Articulation'}},
  {tid:'T15', type:'ex',  num:16, find:{blockquoteContains:'Final response test'}},
  {tid:'T16', type:'fing',num:9,  find:{h3Text:'16.1: Harmonic Tuning'}},
  {tid:'T17', type:'fing',num:10, find:{h3Text:'17.1: One‑Handed Slurs'}},
  {tid:'T18', type:'fing',num:11, find:{h3Text:'18.1: Slur Up to C, D, E♭ and F'}},
  {tid:'T19', type:'ex',  num:17, find:{h3Text:'19.1: Articulation – Finger A♭ with F'}},
  {tid:'T20', type:'ex',  num:18, find:{h3Text:'Test A'}},
  {tid:'T20', type:'ex',  num:19, find:{h3Text:'Test B'}},
  {tid:'T20', type:'ex',  num:20, find:{h3Text:'Test C'}},
];

function ensureSubGrid(target) {
  const next = target.nextElementSibling;
  if (next && next.classList && next.classList.contains('fig-grid')) return next; // reuse
  const grid = document.createElement('div');
  grid.className = 'fig-grid';
  target.parentNode.insertBefore(grid, target.nextSibling);
  return grid;
}

function renderSectionMedia() {
  sectionMediaMap.forEach(item => {
    const art = document.getElementById(item.tid);
    if (!art) return;

    // Find heading or blockquote
    let target = null;
    if (item.find && item.find.h3Text) {
      for (const h of art.querySelectorAll('h3')) {
        if ((h.textContent || '').trim() === item.find.h3Text) { target = h; break; }
      }
    }
    if (!target && item.find && item.find.blockquoteContains) {
      for (const b of art.querySelectorAll('blockquote')) {
        if ((b.textContent || '').toLowerCase().includes(item.find.blockquoteContains.toLowerCase())) { target = b; break; }
      }
    }
    // Create missing heading if specified
    if (!target && item.find && item.find.h3Text) {
      const details = art.querySelector('.details');
      if (details) {
        const h = document.createElement('h3'); h.textContent = item.find.h3Text;
        details.parentNode.insertBefore(h, details); target = h;
      }
    }
    if (!target) return;

    // Unique tile guard
    const id = `media-${item.tid}-${item.type}-${item.num}`;
    if (document.getElementById(id)) return;

    const base    = item.type === 'fing' ? `img/fing-${item.num}.png` : `img/ex-${item.num}.png`;
    const caption = item.type === 'fing' ? `Fingering ${item.num}`     : `Exercise ${item.num}`;

    const fig = document.createElement('figure');
    fig.className = `section-media ${item.type}`;
    fig.id = id;
    fig.innerHTML = `
      <img src="${base}" alt="${caption}" loading="lazy"
           onclick="openFig('${base}','${caption}')"
           onerror="this.closest('figure').remove()">
      <figcaption>${caption}</figcaption>
    `;

    const grid = ensureSubGrid(target);
    grid.appendChild(fig);
  });
}

// === Once guards to prevent duplicates ===
function renderFiguresOnce() {
  if (window.__RENDER_FIGURES_DONE__) return;
  window.__RENDER_FIGURES_DONE__ = true;
  renderFigures();
}
function renderSectionMediaOnce() {
  if (window.__RENDER_SECTION_MEDIA_DONE__) return;
  window.__RENDER_SECTION_MEDIA_DONE__ = true;
  renderSectionMedia();
}

// === Single init path ===
window.addEventListener('DOMContentLoaded', function () {
  // If body has onload="openTest('Intro')", this will still be safe
  renderFiguresOnce();
  renderSectionMediaOnce();
  openTest('Intro', { fromUser: false });
});


// === Zoom Modal: open, close, and interactions ===
(function zoomModalInitIIFE() {
  let scale = 1;      // current zoom
  let minScale = 1;   // fit-to-stage
  let maxScale = 4;   // cap zoom
  let translateX = 0; // pan offset
  let translateY = 0;
  let isDragging = false;
  let lastX = 0, lastY = 0;

  const modal = document.getElementById('figModal');
  const img   = document.getElementById('figModalImg');

  // If modal isn't in DOM (user kept older HTML), bail gracefully
  if (!modal || !img) return;

  function applyTransform() {
    img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  function resetTransform() {
    scale = minScale = 1;
    maxScale = 4;
    translateX = translateY = 0;
    applyTransform();
    img.style.cursor = (scale > minScale) ? 'grab' : 'zoom-in';
  }

  // Public: open image
  window.openFig = function(src, caption) {
    img.src = src;
    img.alt = caption || '';

    // Ensure image is loaded before we compute fit-scale
    img.onload = function() {
      // fit image inside stage; we keep minScale at 1 since max-width/height handles fit
      // optional: if you want true fit-to-stage beyond CSS, compute bounding box here

      resetTransform();
      modal.classList.add('show');
      document.body.classList.add('modal-open');
      modal.setAttribute('aria-hidden', 'false');
      img.focus(); // focus for key events on some browsers
    };
    img.onerror = function() {
      // if image fails, close modal quietly
      closeFigModal();
    };
  };

  // Public: close modal
  window.closeFigModal = function() {
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
    modal.setAttribute('aria-hidden', 'true');
    // clear src to free memory on mobile when closing
    img.src = '';
    resetTransform();
  };

  // Wheel zoom (desktop): mouse wheel to zoom in/out around center
  modal.addEventListener('wheel', function(e) {
    e.preventDefault();
    // normalize zoom step
    const delta = Math.sign(e.deltaY);
    const step = 0.15;
    const newScale = Math.min(maxScale, Math.max(minScale, scale - delta * step));
    if (newScale !== scale) {
      scale = newScale;
      // keep translation within reasonable bounds after zoom
      translateX = Math.max(Math.min(translateX, (scale-1)*img.clientWidth/2), -(scale-1)*img.clientWidth/2);
      translateY = Math.max(Math.min(translateY, (scale-1)*img.clientHeight/2), -(scale-1)*img.clientHeight/2);
      applyTransform();
      img.style.cursor = (scale > minScale) ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in';
    }
  }, { passive: false });

  // Drag to pan when zoomed
  img.addEventListener('mousedown', function(e) {
    if (scale <= minScale) return;
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    img.style.cursor = 'grabbing';
    e.preventDefault();
  });

  window.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    translateX += dx;
    translateY += dy;
    applyTransform();
  });

  window.addEventListener('mouseup', function() {
    if (!isDragging) return;
    isDragging = false;
    img.style.cursor = (scale > minScale) ? 'grab' : 'zoom-in';
  });

  // Touch: double-tap to toggle zoom; drag to pan
  let lastTap = 0;
  img.addEventListener('touchstart', function(e) {
    const now = Date.now();
    if (now - lastTap < 300) {
      // double tap → toggle between minScale and ~2x
      scale = (scale > minScale + 0.01) ? minScale : Math.min(maxScale, 2);
      translateX = translateY = 0;
      applyTransform();
      lastTap = 0;
      e.preventDefault();
      return;
    }
    lastTap = now;

    if (scale > minScale && e.touches.length === 1) {
      isDragging = true;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      img.style.cursor = 'grabbing';
    }
  }, { passive: false });

  img.addEventListener('touchmove', function(e) {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastX;
    const dy = e.touches[0].clientY - lastY;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
    translateX += dx;
    translateY += dy;
    applyTransform();
  }, { passive: false });

  img.addEventListener('touchend', function() {
    isDragging = false;
    img.style.cursor = (scale > minScale) ? 'grab' : 'zoom-in';
  });

  // Double-click (desktop) to toggle zoom
  img.addEventListener('dblclick', function() {
    scale = (scale > minScale + 0.01) ? minScale : Math.min(maxScale, 2.5);
    translateX = translateY = 0;
    applyTransform();
  });

  // ESC to close
  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeFigModal();
    }
  });
})();



// === Mobile drawer helpers ===
function toggleSidebar(open) {
  const sidebar = document.querySelector('.sidebar');
  const scrim   = document.getElementById('scrim');
  if (!sidebar || !scrim) return;

  if (open) {
    sidebar.classList.add('open');
    scrim.classList.add('show');
  } else {
    sidebar.classList.remove('open');
    scrim.classList.remove('show');
  }
}

// Wire up the hamburger button
(function initMenuToggle() {
  const btn = document.getElementById('menuToggle');
  if (!btn) return;
  btn.addEventListener('click', () => toggleSidebar(true));
})();
