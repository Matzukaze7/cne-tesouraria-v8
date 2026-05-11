window.CNE = window.CNE || {};

CNE.contagens = {
  notas: [500, 200, 100, 50, 20, 10, 5],
  moedas: [2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01]
};

CNE.totalDenominacoes = function totalDenominacoes(items = {}) {
  return Object.entries(items).reduce((acc, [valor, qtd]) => {
    return acc + (Number(valor) * Number(qtd || 0));
  }, 0);
};

CNE.createContagemPayload = function createContagemPayload(input = {}) {
  const notas = input.notas || {};
  const moedas = input.moedas || {};

  return {
    id: input.id || crypto.randomUUID(),
    secao: input.secao || 'Agrupamento',
    notas,
    moedas,
    total_notas: CNE.totalDenominacoes(notas),
    total_moedas: CNE.totalDenominacoes(moedas),
    total_geral: CNE.totalDenominacoes(notas) + CNE.totalDenominacoes(moedas),
    estado_validacao: input.estado_validacao || 'rascunho',
    observacoes: input.observacoes || ''
  };
};