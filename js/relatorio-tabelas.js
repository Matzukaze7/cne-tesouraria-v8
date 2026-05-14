window.CNE = window.CNE || {};

CNE.relatorio = CNE.relatorio || {};

CNE.relatorio.movimentosTabela = function movimentosTabela(rows = [], state = {}) {
  return `
    <table>
      <tr>
        <th>Data</th>
        <th>Tipo</th>
        <th>SIIC</th>
        <th>Descrição</th>
        <th>Estado</th>
        <th>Valor</th>
      </tr>

      ${rows.map(row => `
        <tr>
          <td>${CNE.report.escape(row.data_operacao || row.created_at || '')}</td>
          <td>${CNE.report.escape(row.tipo || '')}</td>
          <td>${CNE.report.escape(row.tipo_movimento || '')}</td>
          <td>${CNE.report.escape(row.descricao || '')}</td>
          <td>${CNE.relatorio.estadoBadge(row.estado_validacao || 'rascunho')}</td>
          <td class="right nowrap">${CNE.report.euro(row.valor || 0)}</td>
        </tr>
      `).join('')}
    </table>
  `;
};

CNE.relatorio.seccaoSubtotalTabela = function seccaoSubtotalTabela(rows = []) {
  const secoes = [...new Set(rows.map(row => row.secao_origem || 'Agrupamento'))];

  return `
    <table>
      <tr>
        <th>Secção</th>
        <th>Recebimentos</th>
        <th>Pagamentos</th>
        <th>Total</th>
      </tr>

      ${secoes.map(secao => {
        const subset = rows.filter(row => (row.secao_origem || 'Agrupamento') === secao);

        return `
          <tr>
            <td>${CNE.report.escape(secao)}</td>
            <td class="right nowrap">${CNE.report.euro(CNE.report.recebimentos(subset))}</td>
            <td class="right nowrap">${CNE.report.euro(CNE.report.pagamentos(subset))}</td>
            <td class="right nowrap">${CNE.report.euro(CNE.report.totalLiquido(subset))}</td>
          </tr>
        `;
      }).join('')}
    </table>
  `;
};