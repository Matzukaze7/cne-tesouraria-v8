window.CNE = window.CNE || {};

CNE.relatorioDomLite = CNE.relatorioDomLite || {};

CNE.relatorioDomLite.compactRow = function compactRow(payload = {}) {
  return `
    <div class="report-row-lite" data-row-id="${payload.id || crypto.randomUUID()}">
      <div class="report-row-main">
        <span class="report-date">${CNE.esc(payload.data_operacao || '')}</span>
        <strong>${CNE.esc(payload.descricao || '')}</strong>
      </div>

      <div class="report-row-meta">
        <span>${CNE.esc(payload.tipo_movimento || '')}</span>
        <span>${CNE.esc(payload.secao_origem || 'Agrupamento')}</span>
        <span class="report-value">${CNE.euro(payload.valor || 0)}</span>
      </div>
    </div>
  `;
};

CNE.relatorioDomLite.renderCompactList = async function renderCompactList({
  selector = '',
  rows = []
} = {}) {
  const container = document.querySelector(selector);

  if (!container) return;

  container.innerHTML = '';

  return CNE.lazyRender.renderChunk({
    items: rows,
    container,
    renderItem: CNE.relatorioDomLite.compactRow,
    batchSize: 40,
    delay: 4
  });
};

CNE.relatorioDomLite.switchMode = function switchMode(mode = 'compact') {
  document.body.dataset.reportMode = mode;
};

CNE.relatorioDomLite.autoCompact = function autoCompact(rows = []) {
  if (rows.length > 150) {
    CNE.relatorioDomLite.switchMode('compact');
    return true;
  }

  return false;
};

CNE.relatorioDomLite.summaryBadge = function summaryBadge(rows = []) {
  const total = rows.reduce((sum, row) => sum + Number(row.valor || 0), 0);

  return `
    <div class="report-summary-lite">
      <span>${rows.length} movimentos</span>
      <strong>${CNE.euro(total)}</strong>
    </div>
  `;
};