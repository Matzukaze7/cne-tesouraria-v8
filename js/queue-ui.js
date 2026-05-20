window.CNE = window.CNE || {};

CNE.queueUI = CNE.queueUI || {};

CNE.queueUI.statusLabel = function statusLabel(status = 'pending') {
  const labels = {
    pending: 'Pendente',
    syncing: 'A sincronizar',
    synced: 'Sincronizado',
    error: 'Erro',
    conflict: 'Conflito'
  };

  return labels[status] || status;
};

CNE.queueUI.statusClass = function statusClass(status = 'pending') {
  return `queue-status-${status}`;
};

CNE.queueUI.renderItem = function renderItem(item = {}) {
  return `
    <article class="queue-card ${CNE.queueUI.statusClass(item.sync_status)}" data-row-id="${item.id || crypto.randomUUID()}">
      <header class="queue-card-header">
        <strong>${CNE.esc(item.descricao || 'Operação')}</strong>
        <span class="status-badge">
          ${CNE.queueUI.statusLabel(item.sync_status || 'pending')}
        </span>
      </header>

      <section class="queue-card-body">
        <div>
          <small>Última atualização</small>
          <span>${CNE.esc(item.sync_updated_at || '')}</span>
        </div>

        <div>
          <small>Tipo</small>
          <span>${CNE.esc(item.tipo_movimento || '')}</span>
        </div>

        <div>
          <small>Valor</small>
          <strong>${CNE.euro(item.valor || 0)}</strong>
        </div>
      </section>

      ${item.sync_error ? `
        <footer class="queue-card-error">
          ${CNE.esc(item.sync_error)}
        </footer>
      ` : ''}
    </article>
  `;
};

CNE.queueUI.renderQueue = async function renderQueue({
  selector = '',
  queue = []
} = {}) {
  const container = document.querySelector(selector);
  if (!container) return;

  container.innerHTML = '';

  return CNE.lazyRender.renderChunk({
    items: queue,
    container,
    renderItem: CNE.queueUI.renderItem,
    batchSize: 15,
    delay: 5
  });
};

CNE.queueUI.renderSummary = function renderSummary(queue = []) {
  const summary = CNE.syncBatch.summary(queue);

  return `
    <div class="queue-summary">
      <span>Pendentes: ${summary.pending || 0}</span>
      <span>Sync: ${summary.syncing || 0}</span>
      <span>Erros: ${summary.error || 0}</span>
      <span>Conflitos: ${summary.conflict || 0}</span>
    </div>
  `;
};

CNE.queueUI.autoRefresh = function autoRefresh({
  selector = '',
  queue = []
} = {}) {
  setInterval(() => {
    CNE.queueUI.renderQueue({ selector, queue });
  }, 5000);
};