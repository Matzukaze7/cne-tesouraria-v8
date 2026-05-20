window.CNE = window.CNE || {};

CNE.lazyRender = CNE.lazyRender || {};

CNE.lazyRender.DEFAULT_BATCH = 50;

CNE.lazyRender.renderChunk = async function renderChunk({
  items = [],
  container = null,
  renderItem = () => '',
  batchSize = CNE.lazyRender.DEFAULT_BATCH,
  delay = 0
} = {}) {
  if (!container) return;

  let index = 0;

  async function nextBatch() {
    const chunk = items.slice(index, index + batchSize);

    if (!chunk.length) return;

    const html = chunk
      .map(renderItem)
      .join('');

    requestAnimationFrame(() => {
      container.insertAdjacentHTML('beforeend', html);
    });

    index += batchSize;

    if (index < items.length) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return nextBatch();
    }
  }

  return nextBatch();
};

CNE.lazyRender.virtualWindow = function virtualWindow({
  items = [],
  start = 0,
  size = 100
} = {}) {
  return items.slice(start, start + size);
};

CNE.lazyRender.clearContainer = function clearContainer(selector = '') {
  const container = document.querySelector(selector);
  if (!container) return;

  container.innerHTML = '';
};

CNE.lazyRender.renderTable = async function renderTable({
  selector = '',
  rows = [],
  renderRow = () => ''
} = {}) {
  const container = document.querySelector(selector);
  if (!container) return;

  CNE.lazyRender.clearContainer(selector);

  return CNE.lazyRender.renderChunk({
    items: rows,
    container,
    renderItem: renderRow,
    batchSize: CNE.lazyRender.DEFAULT_BATCH,
    delay: 5
  });
};