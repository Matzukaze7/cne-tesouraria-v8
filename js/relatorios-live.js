window.CNE = window.CNE || {};

CNE.relatoriosLive = CNE.relatoriosLive || {};

CNE.relatoriosLive.renderMovimentoRow = function renderMovimentoRow(payload = {}) {
  return `
    <tr data-row-id="${payload.id || crypto.randomUUID()}">
      <td>${CNE.esc(payload.data_operacao || '')}</td>
      <td>${CNE.esc(payload.descricao || '')}</td>
      <td>${CNE.esc(payload.tipo_movimento || '')}</td>
      <td>${CNE.esc(payload.secao_origem || 'Agrupamento')}</td>
      <td class="right nowrap">${CNE.euro(payload.valor || 0)}</td>
    </tr>
  `;
};

CNE.relatoriosLive.appendMovimento = function appendMovimento(payload = {}) {
  const tableBody = document.querySelector('#relatorioMovimentos tbody');

  if (!tableBody) return;

  requestAnimationFrame(() => {
    tableBody.insertAdjacentHTML(
      'beforeend',
      CNE.relatoriosLive.renderMovimentoRow(payload)
    );
  });
};

CNE.relatoriosLive.updateMovimento = function updateMovimento(payload = {}) {
  const html = CNE.relatoriosLive.renderMovimentoRow(payload);

  CNE.realtimeGranular.updateRow(
    '#relatorioMovimentos tbody',
    payload.id,
    html
  );
};

CNE.relatoriosLive.registerRealtime = function registerRealtime() {
  CNE.realtimeGranular.register('relatorio_movimento_criado', payloads => {
    payloads.forEach(payload => {
      CNE.relatoriosLive.appendMovimento(payload);
    });
  });

  CNE.realtimeGranular.register('relatorio_movimento_atualizado', payloads => {
    payloads.forEach(payload => {
      CNE.relatoriosLive.updateMovimento(payload);
    });
  });
};

window.addEventListener('load', () => {
  CNE.relatoriosLive.registerRealtime();
});