window.CNE = window.CNE || {};

CNE.recTotal = function recTotal(rows = []) {
  return CNE.sumBy(rows.filter(r => r.tipo === 'recebimento'), r => r.valor);
};

CNE.pagTotal = function pagTotal(rows = []) {
  return CNE.sumBy(rows.filter(r => r.tipo === 'pagamento'), r => r.valor);
};

CNE.totalLiquido = function totalLiquido(rows = []) {
  return CNE.recTotal(rows) - CNE.pagTotal(rows);
};

CNE.movimentosPorEstado = function movimentosPorEstado(rows = [], estado = 'todos') {
  if (estado === 'todos') return rows;
  return rows.filter(r => r.estado_validacao === estado);
};

CNE.movimentosPorTrimestre = function movimentosPorTrimestre(rows = [], trimestre = '') {
  if (!trimestre) return rows;

  return rows.filter(r => {
    const data = r.data_operacao || r.data || r.created_at || '';
    return CNE.trimestreEscutista(String(data).slice(0, 10)) === trimestre;
  });
};

CNE.siicSubtotais = function siicSubtotais(rows = []) {
  const grouped = CNE.groupBy(rows, r => r.tipo_movimento || 'Sem tipo SIIC');

  return Object.entries(grouped).map(([tipo, movs]) => ({
    tipo,
    recebimentos: CNE.recTotal(movs),
    pagamentos: CNE.pagTotal(movs),
    liquido: CNE.totalLiquido(movs)
  }));
};

CNE.subtotaisSecao = function subtotaisSecao(rows = []) {
  const grouped = CNE.groupBy(rows, r => r.secao_origem || r.secao || 'Agrupamento');

  return Object.entries(grouped).map(([secao, movs]) => ({
    secao,
    recebimentos: CNE.recTotal(movs),
    pagamentos: CNE.pagTotal(movs),
    liquido: CNE.totalLiquido(movs),
    quantidade: movs.length
  }));
};

CNE.calcularSaldos = function calcularSaldos(rows = [], saldoInicial = { caixa: 0, banco: 0 }) {
  const caixaRows = rows.filter(r => (r.origem || 'caixa') === 'caixa');
  const bancoRows = rows.filter(r => (r.origem || '') === 'banco');

  const caixaInicial = Number(saldoInicial.caixa || 0);
  const bancoInicial = Number(saldoInicial.banco || 0);

  const caixaFinal = caixaInicial + CNE.totalLiquido(caixaRows);
  const bancoFinal = bancoInicial + CNE.totalLiquido(bancoRows);

  return {
    caixaInicial,
    bancoInicial,
    caixaFinal,
    bancoFinal,
    totalInicial: caixaInicial + bancoInicial,
    totalFinal: caixaFinal + bancoFinal
  };
};