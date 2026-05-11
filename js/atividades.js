window.CNE = window.CNE || {};

CNE.atividades = CNE.atividades || {};

CNE.effectiveAmbito = function effectiveAmbito(secao, ambito) {
  return secao === 'Agrupamento' || ambito === 'agrupamento' ? 'agrupamento' : 'secao';
};

CNE.contaFinanceira = function contaFinanceira(secao, ambito) {
  return CNE.effectiveAmbito(secao, ambito) === 'agrupamento' ? 'agrupamento' : 'secao';
};

CNE.tipoOwner = function tipoOwner(secao, ambito) {
  return CNE.contaFinanceira(secao, ambito) === 'agrupamento' ? 'Agrupamento' : secao;
};

CNE.tiposAtividade = function tiposAtividade(secao, ambito) {
  const owner = CNE.tipoOwner(secao, ambito);
  return CNE.state?.config?.tipos?.[owner] || [];
};

CNE.createAtividadePayload = function createAtividadePayload(input = {}) {
  const secao = input.secao || 'Expedição';
  const ambitoReal = CNE.effectiveAmbito(secao, input.ambito || 'secao');
  const conta = CNE.contaFinanceira(secao, ambitoReal);

  return {
    id: input.id || crypto.randomUUID(),
    nome: String(input.nome || '').trim(),
    secao,
    secao_origem: secao,
    ambito: ambitoReal,
    conta_financeira: conta,
    validador_nivel: conta === 'agrupamento' ? 'agrupamento' : 'secao',
    tipo: input.tipo || CNE.tiposAtividade(secao, ambitoReal)[0] || '',
    data_inicio: input.data_inicio || null,
    data_fim: input.data_fim || input.data_inicio || null,
    local: input.local || '',
    valor_padrao: Number(input.valor_padrao || 0),
    estado: input.estado || 'aberta'
  };
};

CNE.createPresencaPayload = function createPresencaPayload(pessoaId, atividadeId, estado = 'pendente') {
  return {
    id: `${pessoaId}_${atividadeId}`,
    pessoa_id: pessoaId,
    atividade_id: atividadeId,
    estado,
    estado_validacao: 'rascunho'
  };
};