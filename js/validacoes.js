window.CNE = window.CNE || {};

CNE.validacoes = {
  estados: ['rascunho', 'por_validar', 'validado', 'consolidado']
};

CNE.nextValidationState = function nextValidationState(current = 'rascunho') {
  const idx = CNE.validacoes.estados.indexOf(current);
  return CNE.validacoes.estados[Math.min(idx + 1, CNE.validacoes.estados.length - 1)];
};

CNE.canConsolidate = function canConsolidate(row = {}) {
  return (row.conta_financeira || row.ambito) === 'agrupamento';
};

CNE.validationBadge = function validationBadge(state = 'rascunho') {
  const labels = {
    rascunho: 'Rascunho',
    por_validar: 'Por validar',
    validado: 'Validado',
    consolidado: 'Consolidado'
  };

  return `<span class="badge badge-${state}">${labels[state] || state}</span>`;
};

CNE.advanceValidation = async function advanceValidation(table, row) {
  const next = CNE.nextValidationState(row.estado_validacao || 'rascunho');

  const response = await CNE.db
    .from(table)
    .update({ estado_validacao: next })
    .eq('id', row.id);

  if (response.error) throw response.error;

  row.estado_validacao = next;
  CNE.setPendingChanges?.(false);

  return row;
};