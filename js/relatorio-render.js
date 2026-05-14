window.CNE = window.CNE || {};

CNE.relatorio = CNE.relatorio || {};

CNE.relatorio.meta = function meta(items = []) {
  return `
    <div class="meta">
      ${items.map(item => `
        <div>
          <b>${CNE.report.escape(item[0])}</b>
          ${item[1]}
        </div>
      `).join('')}
    </div>
  `;
};

CNE.relatorio.totais = function totais(rows = []) {
  return `
    <h3>Totais</h3>
    <div class="totals">
      <div class="box">
        <p><b>Recebimentos:</b> ${CNE.report.euro(CNE.report.recebimentos(rows))}</p>
      </div>

      <div class="box">
        <p><b>Pagamentos:</b> ${CNE.report.euro(CNE.report.pagamentos(rows))}</p>
      </div>

      <div class="box">
        <p><b>Total líquido:</b> ${CNE.report.euro(CNE.report.totalLiquido(rows))}</p>
      </div>
    </div>
  `;
};

CNE.relatorio.estadoBadge = function estadoBadge(state = 'rascunho') {
  const labels = {
    rascunho: 'Rascunho',
    por_validar: 'Por validar',
    validado: 'Validado',
    consolidado: 'Consolidado'
  };

  return `<span class="badge badge-${state}">${labels[state] || state}</span>`;
};