const testsOrder = ['Intro','T01','T02','T03','T04','T05','T06','T07','T08','T09','T10','T11','T12','T13','T14','T15','T16','T17','T18','T19','T20'];

window.openTest = function(id) {
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
};

window.nextTest = function(current) {
  const idx = testsOrder.indexOf(current);
  if (idx >= 0 && idx < testsOrder.length - 1) openTest(testsOrder[idx + 1]);
  else alert('You have reached the final test.');
};

window.prevTest = function(current) {
  const idx = testsOrder.indexOf(current);
  if (idx > 0) openTest(testsOrder[idx - 1]);
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
  openTest(refId);
};

window.filterTabs = function() {
  const q = (document.getElementById('search').value || '').toLowerCase();
  testsOrder.forEach(tid => {
    const tab = document.getElementById('tab-' + tid);
    if (tab) tab.style.display = tab.textContent.toLowerCase().includes(q) ? 'block' : 'none';
  });
};

window.addEventListener('DOMContentLoaded', function () {
  openTest('Intro');
});
