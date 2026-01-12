// Order of tests for Prev/Next navigation
const testsOrder = [
  'Intro','T01','T02','T03','T04','T05','T06','T07','T08','T09','T10',
  'T11','T12','T13','T14','T15','T16','T17','T18','T19','T20'
];

// Open a given test tab
function openTest(id) {
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
  // Scroll to top of content
  const content = document.getElementById('content');
  if (content) content.scrollTop = 0;
}

// Move forward
function nextTest(current) {
  const idx = testsOrder.indexOf(current);
  if (idx >= 0 && idx < testsOrder.length - 1) {
    openTest(testsOrder[idx + 1]);
  } else {
    alert('You have reached the final test.');
  }
}

// Move backward
function prevTest(current) {
  const idx = testsOrder.indexOf(current);
  if (idx > 0) {
    openTest(testsOrder[idx - 1]);
  } else {
    alert('You are at the beginning.');
  }
}

// Show/hide “Issue → Solutions” (details)
function toggleDetails(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const showing = el.classList.contains('show');
  el.classList.toggle('show', !showing);
  if (!showing) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Cross-reference jump (e.g., Go to T02)
function goToRef(fromId, refId) {
  openTest(refId);
}

// Filter tabs by search
function filterTabs() {
  const q = (document.getElementById('search').value || '').toLowerCase();
  testsOrder.forEach(tid => {
    const tab = document.getElementById('tab-' + tid);
    if (tab) {
      const visible = tab.textContent.toLowerCase().includes(q);
      tab.style.display = visible ? 'block' : 'none';
    }
  });
}
