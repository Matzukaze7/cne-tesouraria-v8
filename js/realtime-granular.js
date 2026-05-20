window.CNE = window.CNE || {};

CNE.realtimeGranular = CNE.realtimeGranular || {};

CNE.realtimeGranular.listeners = new Map();

CNE.realtimeGranular.register = function register(key, callback) {
  if (!key || typeof callback !== 'function') return;

  CNE.realtimeGranular.listeners.set(key, callback);
};

CNE.realtimeGranular.unregister = function unregister(key) {
  CNE.realtimeGranular.listeners.delete(key);
};

CNE.realtimeGranular.notify = function notify(key, payload = {}) {
  const listener = CNE.realtimeGranular.listeners.get(key);

  if (!listener) return;

  try {
    listener(payload);
  } catch (error) {
    console.error('Erro realtime granular', error);
  }
};

CNE.realtimeGranular.updateRow = function updateRow(tableSelector, rowId, html) {
  const table = document.querySelector(tableSelector);
  if (!table) return;

  const row = table.querySelector(`[data-row-id="${rowId}"]`);
  if (!row) return;

  if (row.dataset.lastHtml === html) return;

  row.dataset.lastHtml = html;
  row.outerHTML = html;
};

CNE.realtimeGranular.safePatch = function safePatch(containerSelector, partialHtml) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  requestAnimationFrame(() => {
    container.insertAdjacentHTML('beforeend', partialHtml);
  });
};

CNE.realtimeGranular.batchNotify = function batchNotify(events = []) {
  const grouped = {};

  events.forEach(event => {
    grouped[event.key] = grouped[event.key] || [];
    grouped[event.key].push(event.payload);
  });

  Object.entries(grouped).forEach(([key, payloads]) => {
    CNE.realtimeGranular.notify(key, payloads);
  });
};