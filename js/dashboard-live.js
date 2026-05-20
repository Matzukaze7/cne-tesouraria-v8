window.CNE = window.CNE || {};

CNE.dashboardLive = CNE.dashboardLive || {};

CNE.dashboardLive.updateMovimentoCard = function updateMovimentoCard(payload = {}) {
  const selector = '#movimentosRecentes';

  const html = `
    <div class="movement-card" data-row-id="${payload.id || crypto.randomUUID()}">
      <div class="movement-main">
        <strong>${CNE.esc(payload.descricao || 'Movimento')}</strong>
        <span>${CNE.euro(payload.valor || 0)}</span>
      </div>

      <div class="movement-meta">
        <span>${CNE.esc(payload.tipo_movimento || '')}</span>
        <span>${CNE.esc(payload.secao_origem || 'Agrupamento')}</span>
      </div>
    </div>
  `;

  CNE.realtimeGranular.safePatch(selector, html);
};

CNE.dashboardLive.registerRealtime = function registerRealtime() {
  CNE.realtimeGranular.register('movimento_criado', payloads => {
    payloads.forEach(payload => {
      CNE.dashboardLive.updateMovimentoCard(payload);
    });
  });

  CNE.realtimeGranular.register('movimento_atualizado', payloads => {
    payloads.forEach(payload => {
      const html = `
        <div class="movement-card" data-row-id="${payload.id}">
          <div class="movement-main">
            <strong>${CNE.esc(payload.descricao || 'Movimento')}</strong>
            <span>${CNE.euro(payload.valor || 0)}</span>
          </div>

          <div class="movement-meta">
            <span>${CNE.esc(payload.tipo_movimento || '')}</span>
            <span>${CNE.esc(payload.sync_status || '')}</span>
          </div>
        </div>
      `;

      CNE.realtimeGranular.updateRow(selector, payload.id, html);
    });
  });
};

window.addEventListener('load', () => {
  CNE.dashboardLive.registerRealtime();
});