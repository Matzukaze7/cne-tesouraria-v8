window.CNE = window.CNE || {};

CNE.transferencias = CNE.transferencias || {};

CNE.transferencias.isInterna = function isInterna(row = {}) {
  const tipo = String(row.tipo || '').toLowerCase();
  const siic = String(row.tipo_movimento || '').toLowerCase();
  const descricao = String(row.descricao || '').toLowerCase();

  return tipo === 'transferencia'
    || siic.includes('mov. tesouraria')
    || siic.includes('transfer')
    || descricao.includes('caixa para banco')
    || descricao.includes('banco para caixa')
    || descricao.includes('transferência interna')
    || descricao.includes('transferencia interna');
};

CNE.transferencias.filtrarFinanceiroReal = function filtrarFinanceiroReal(rows = []) {
  return rows.filter(row => !CNE.transferencias.isInterna(row));
};

CNE.transferencias.resumo = function resumo(rows = []) {
  const internas = rows.filter(CNE.transferencias.isInterna);
  const reais = CNE.transferencias.filtrarFinanceiroReal(rows);

  return {
    movimentos_reais: reais.length,
    transferencias_internas: internas.length,
    total_transferencias: internas.reduce((sum, row) => sum + Number(row.valor || 0), 0)
  };
};

CNE.transferencias.marcarInterna = function marcarInterna(row = {}) {
  return {
    ...row,
    tipo: 'transferencia',
    afeta_resultado: false,
    is_transferencia_interna: true
  };
};