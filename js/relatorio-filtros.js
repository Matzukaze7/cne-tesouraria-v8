window.CNE = window.CNE || {};

CNE.relatorio = CNE.relatorio || {};

CNE.relatorio.tipos = [
  'atividade',
  'pessoa',
  'trimestre'
];

CNE.relatorio.getFilterConfig = function getFilterConfig(tipo = '') {
  switch (tipo) {
    case 'atividade':
      return {
        atividade: true,
        secao: true,
        agrupamento: true,
        trimestre: false,
        pessoa: false
      };

    case 'pessoa':
      return {
        atividade: false,
        secao: true,
        agrupamento: true,
        trimestre: true,
        pessoa: true
      };

    case 'trimestre':
      return {
        atividade: false,
        secao: true,
        agrupamento: true,
        trimestre: true,
        pessoa: false
      };

    default:
      return {};
  }
};

CNE.relatorio.renderFilterVisibility = function renderFilterVisibility(tipo = '') {
  const config = CNE.relatorio.getFilterConfig(tipo);

  Object.entries(config).forEach(([field, visible]) => {
    const element = document.querySelector(`[data-filter="${field}"]`);

    if (!element) return;

    element.style.display = visible ? '' : 'none';
  });
};

CNE.relatorio.populateTipoSelector = function populateTipoSelector(selector) {
  if (!selector) return;

  selector.innerHTML = `
    <option value="">Selecionar relatório</option>
    ${CNE.relatorio.tipos.map(tipo => `
      <option value="${tipo}">${tipo}</option>
    `).join('')}
  `;
};