window.CNE = window.CNE || {};

CNE.performance = {
  renders: new Map(),
  timers: new Map()
};

CNE.memoRender = function memoRender(key, generator) {
  const cache = CNE.performance.renders.get(key);

  if (cache) return cache;

  const html = generator();
  CNE.performance.renders.set(key, html);

  return html;
};

CNE.invalidateRender = function invalidateRender(key = null) {
  if (!key) {
    CNE.performance.renders.clear();
    return;
  }

  CNE.performance.renders.delete(key);
};

CNE.debounce = function debounce(name, fn, delay = 300) {
  clearTimeout(CNE.performance.timers.get(name));

  const timer = setTimeout(() => {
    fn();
    CNE.performance.timers.delete(name);
  }, delay);

  CNE.performance.timers.set(name, timer);
};

CNE.safeInnerHTML = function safeInnerHTML(element, html) {
  if (!element) return;

  if (element.dataset.lastHtml === html) return;

  element.dataset.lastHtml = html;
  element.innerHTML = html;
};