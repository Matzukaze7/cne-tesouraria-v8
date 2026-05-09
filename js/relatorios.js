window.CNE = window.CNE || {};

CNE.relatorios = {
  cache: {},
  lastRender: null
};

CNE.relatorioScope = function relatorioScope() {
  return CNE.$('relScope')?.value || 'Agrupamento';
};

CNE.isAgrupamento = function isAgrupamento() {
  return CNE.relatorioScope() === 'Agrupamento';
};

CNE.scopeActivities = function scopeActivities() {
  const scope = CNE.relatorioScope();

  return CNE.state.atividades.filter(a => {
    const origem = a.secao_origem || a.secao || 'Agrupamento';
    const agrupamento = (a.ambito || a.conta_financeira) === 'agrupamento';

    if (scope === 'Agrupamento') return agrupamento || origem === 'Agrupamento';

    return origem === scope && !agrupamento;
  });
};

CNE.scopeMovimentos = function scopeMovimentos(rows = CNE.state.movimentos) {
  const scope = CNE.relatorioScope();

  return rows.filter(m => {
    const origem = m.secao_origem || m.secao || 'Agrupamento';
    const agrupamento = (m.ambito || m.conta_financeira) === 'agrupamento';

    if (scope === 'Agrupamento') return agrupamento || origem === 'Agrupamento';

    return origem === scope && !agrupamento;
  });
};

CNE.movimentosTabela = function movimentosTabela(rows = []) {
  return `
    <table>
      <tr>
        <th>Data</th>
        <th>Origem</th>
        <th>Pessoa</th>
        <th>Tipo</th>
        <th>SIIC</th>
        <th>Estado</th>
        <th>Valor</th>
      </tr>
      ${rows.map(m => {
        const pessoa = CNE.state.pessoas.find(p => p.id === m.pessoa_id);
        return `
          <tr>
            <td>${CNE.esc(CNE.dateOnly(m.data_operacao || m.created_at || ''))}</td>
            <td>${CNE.esc(m.secao_origem || m.secao || 'Agrupamento')}</td>
            <td>${CNE.esc(pessoa?.nome || '-')}</td>
            <td>${CNE.esc(m.tipo || '')}</td>
            <td>${CNE.esc(m.tipo_movimento || '')}</td>
            <td>${CNE.esc(m.estado_validacao || '')}</td>
            <td class="right nowrap">${CNE.euro(m.valor)}</td>
          </tr>
        `;
      }).join('') || '<tr><td colspan="7">Sem movimentos.</td></tr>'}
    </table>
  `;
};

CNE.renderSubtotaisSIIC = function renderSubtotaisSIIC(rows = []) {
  const subtotais = CNE.siicSubtotais(rows);

  return `
    <h3>Subtotais SIIC</h3>
    <table>
      <tr>
        <th>Tipo SIIC</th>
        <th>Recebimentos</th>
        <th>Pagamentos</th>
        <th>Total líquido</th>
      </tr>
      ${subtotais.map(s => `
        <tr>
          <td>${CNE.esc(s.tipo)}</td>
          <td class="right nowrap">${CNE.euro(s.recebimentos)}</td>
          <td class="right nowrap">${CNE.euro(s.pagamentos)}</td>
          <td class="right nowrap">${CNE.euro(s.liquido)}</td>
        </tr>
      `).join('')}
    </table>
  `;
};

CNE.renderSubtotaisSecao = function renderSubtotaisSecao(rows = []) {
  const subtotais = CNE.subtotaisSecao(rows);

  return `
    <h3>Subtotais por secção</h3>
    <table>
      <tr>
        <th>Secção</th>
        <th>Recebimentos</th>
        <th>Pagamentos</th>
        <th>Total líquido</th>
      </tr>
      ${subtotais.map(s => `
        <tr>
          <td>${CNE.esc(s.secao)}</td>
          <td class="right nowrap">${CNE.euro(s.recebimentos)}</td>
          <td class="right nowrap">${CNE.euro(s.pagamentos)}</td>
          <td class="right nowrap">${CNE.euro(s.liquido)}</td>
        </tr>
      `).join('')}
    </table>
  `;
};

CNE.renderResumoFinanceiro = function renderResumoFinanceiro(rows = []) {
  return `
    <div class="totals">
      <div class="box"><b>Recebimentos</b><br>${CNE.euro(CNE.recTotal(rows))}</div>
      <div class="box"><b>Pagamentos</b><br>${CNE.euro(CNE.pagTotal(rows))}</div>
      <div class="box"><b>Total líquido</b><br>${CNE.euro(CNE.totalLiquido(rows))}</div>
    </div>
  `;
};

CNE.renderRelatorioTrimestre = function renderRelatorioTrimestre() {
  const trimestre = CNE.$('trimestre')?.value || '1º Trimestre';
  const scope = CNE.relatorioScope();

  let rows = CNE.scopeMovimentos();
  rows = CNE.movimentosPorTrimestre(rows, trimestre);

  const branding = CNE.resolveBrandingScope({
    tipo: 'trimestre',
    relScope: scope
  });

  const saldos = CNE.calcularSaldos(rows, CNE.state.config.saldos?.[scope] || {});

  const html = `
    ${CNE.reportHeader('Relatório Trimestral', `${trimestre} — ${scope}`, branding)}

    <div class="meta">
      <div><b>Ano escutista</b>${CNE.anoEscutista()}</div>
      <div><b>Movimentos</b>${rows.length}</div>
      <div><b>Âmbito</b>${CNE.esc(scope)}</div>
    </div>

    <h3>Saldos</h3>
    <div class="totals">
      <div class="box"><b>Caixa inicial</b><br>${CNE.euro(saldos.caixaInicial)}</div>
      <div class="box"><b>Banco inicial</b><br>${CNE.euro(saldos.bancoInicial)}</div>
      <div class="box"><b>Caixa final</b><br>${CNE.euro(saldos.caixaFinal)}</div>
      <div class="box"><b>Banco final</b><br>${CNE.euro(saldos.bancoFinal)}</div>
    </div>

    ${CNE.renderResumoFinanceiro(rows)}
    ${CNE.renderSubtotaisSIIC(rows)}
    ${scope === 'Agrupamento' ? CNE.renderSubtotaisSecao(rows) : ''}

    <h3>Movimentos</h3>
    ${CNE.movimentosTabela(rows)}

    </div>
  `;

  CNE.$('output').innerHTML = html;
  CNE.relatorios.lastRender = new Date().toISOString();
};

CNE.initRelatoriosPage = async function initRelatoriosPage() {
  await CNE.loadData();

  if (CNE.$('relScope')) {
    CNE.$('relScope').innerHTML = CNE.scopes.map(s => `<option>${CNE.esc(s)}</option>`).join('');
  }

  CNE.renderRelatorioTrimestre();

  CNE.subscribeRealtime(['movimentos', 'atividades', 'presencas'], async () => {
    await CNE.partialRefresh('movimentos');
    CNE.renderRelatorioTrimestre();
  });
};