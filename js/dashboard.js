window.CNE = window.CNE || {};

CNE.dashboard = {
  lastUpdate: null
};

CNE.renderDashboard = function renderDashboard() {
  const root = CNE.$('dashboardRoot');
  if (!root) return;

  const movimentos = CNE.state.movimentos || [];
  const atividades = CNE.state.atividades || [];
  const presencas = CNE.state.presencas || [];

  const recebimentos = CNE.recTotal(movimentos);
  const pagamentos = CNE.pagTotal(movimentos);
  const liquido = CNE.totalLiquido(movimentos);

  const porValidar = movimentos.filter(m => m.estado_validacao === 'por_validar').length;
  const rascunhos = movimentos.filter(m => m.estado_validacao === 'rascunho').length;

  const atividadesRecentes = [...atividades]
    .sort((a, b) => new Date(b.created_at || b.data_inicio || 0) - new Date(a.created_at || a.data_inicio || 0))
    .slice(0, 5);

  root.innerHTML = `
    <div class="card">
      <h1>CNE Tesouraria v8</h1>
      <p class="muted">Resumo geral do agrupamento e secções.</p>

      <div class="totals">
        <div class="box">
          <b>Recebimentos</b><br>
          ${CNE.euro(recebimentos)}
        </div>

        <div class="box">
          <b>Pagamentos</b><br>
          ${CNE.euro(pagamentos)}
        </div>

        <div class="box">
          <b>Total líquido</b><br>
          ${CNE.euro(liquido)}
        </div>

        <div class="box">
          <b>Movimentos por validar</b><br>
          ${porValidar}
        </div>

        <div class="box">
          <b>Rascunhos</b><br>
          ${rascunhos}
        </div>

        <div class="box">
          <b>Presenças registadas</b><br>
          ${presencas.length}
        </div>
      </div>
    </div>

    <div class="card">
      <h2>Atividades recentes</h2>

      <table>
        <tr>
          <th>Atividade</th>
          <th>Secção</th>
          <th>Data</th>
          <th>Âmbito</th>
        </tr>

        ${atividadesRecentes.map(a => `
          <tr>
            <td>${CNE.esc(a.nome || '')}</td>
            <td>${CNE.esc(a.secao_origem || a.secao || 'Agrupamento')}</td>
            <td>${CNE.esc(CNE.dateOnly(a.data_inicio || ''))}</td>
            <td>${CNE.esc(a.ambito || 'secao')}</td>
          </tr>
        `).join('') || '<tr><td colspan="4">Sem atividades.</td></tr>'}
      </table>
    </div>
  `;

  CNE.dashboard.lastUpdate = new Date().toISOString();
};

CNE.initDashboardPage = async function initDashboardPage() {
  await CNE.loadData();

  CNE.renderDashboard();

  CNE.subscribeRealtime(['movimentos', 'atividades', 'presencas'], async payload => {
    const table = payload.table;

    if (table) {
      await CNE.partialRefresh(table);
    }

    CNE.renderDashboard();
  });
};