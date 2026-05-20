window.CNE = window.CNE || {};

CNE.mobileCards = CNE.mobileCards || {};

CNE.mobileCards.isMobile = function isMobile() {
  return window.innerWidth <= 900;
};

CNE.mobileCards.movimentoCard = function movimentoCard(payload = {}) {
  const status = payload.sync_status || (navigator.onLine ? 'online' : 'offline');

  return `
    <article class="mobile-card movement-card" data-row-id="${payload.id || crypto.randomUUID()}">
      <header class="mobile-card-header">
        <strong>${CNE.esc(payload.descricao || 'Movimento')}</strong>
        <span class="status-badge">${CNE.esc(status)}</span>
      </header>

      <section class="mobile-card-body">
        <div>
          <small>Secção</small>
          <span>${CNE.esc(payload.secao_origem || 'Agrupamento')}</span>
        </div>

        <div>
          <small>Tipo</small>
          <span>${CNE.esc(payload.tipo_movimento || '')}</span>
        </div>

        <div>
          <small>Valor</small>
          <strong>${CNE.euro(payload.valor || 0)}</strong>
        </div>
      </section>

      <footer class="mobile-card-footer">
        <button class="btn-small">Validar</button>
        <button class="btn-small secondary">Detalhes</button>
      </footer>
    </article>
  `;
};

CNE.mobileCards.renderMovimentos = async function renderMovimentos({
  selector = '',
  rows = []
} = {}) {
  const container = document.querySelector(selector);
  if (!container) return;

  container.innerHTML = '';

  return CNE.lazyRender.renderChunk({
    items: rows,
    container,
    renderItem: CNE.mobileCards.movimentoCard,
    batchSize: 20,
    delay: 4
  });
};

CNE.mobileCards.autoSwitch = function autoSwitch({
  tableSelector = '',
  cardsSelector = ''
} = {}) {
  const table = document.querySelector(tableSelector);
  const cards = document.querySelector(cardsSelector);

  if (!table || !cards) return;

  if (CNE.mobileCards.isMobile()) {
    table.style.display = 'none';
    cards.style.display = 'block';
  } else {
    table.style.display = '';
    cards.style.display = 'none';
  }
};

window.addEventListener('resize', () => {
  CNE.mobileCards.autoSwitch({
    tableSelector: '#relatorioMovimentos',
    cardsSelector: '#mobileMovimentos'
  });
});