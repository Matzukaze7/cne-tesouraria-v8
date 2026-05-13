window.CNE = window.CNE || {};

CNE.report = CNE.report || {};

CNE.report.euro = function euro(value) {
  return Number(value || 0).toLocaleString('pt-PT', {
    style: 'currency',
    currency: 'EUR'
  });
};

CNE.report.escape = function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, match => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[match]));
};

CNE.report.trimLabel = function trimLabel(date) {
  if (!date) return '';

  const month = new Date(date).getMonth() + 1;

  if (month >= 10) return '1º Trimestre';
  if (month <= 3) return '2º Trimestre';
  if (month <= 6) return '3º Trimestre';

  return '4º Trimestre';
};

CNE.report.recebimentos = function recebimentos(rows = []) {
  return rows
    .filter(row => row.tipo === 'recebimento')
    .reduce((sum, row) => sum + Number(row.valor || 0), 0);
};

CNE.report.pagamentos = function pagamentos(rows = []) {
  return rows
    .filter(row => row.tipo === 'pagamento')
    .reduce((sum, row) => sum + Number(row.valor || 0), 0);
};

CNE.report.totalLiquido = function totalLiquido(rows = []) {
  return CNE.report.recebimentos(rows) - CNE.report.pagamentos(rows);
};