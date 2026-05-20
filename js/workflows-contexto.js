window.CNE = window.CNE || {};

CNE.workflowsContexto = CNE.workflowsContexto || {};

CNE.workflowsContexto.applySessao = function applySessao(payload) {
  if (!CNE.sessao || !CNE.sessao.applyDefaults) {
    return payload || {};
  }

  return CNE.sessao.applyDefaults(payload || {});
};

CNE.workflowsContexto.pagamentoRapido = function pagamentoRapido(options) {
  const payload = options || {};

  const row = {
    id: crypto.randomUUID(),
    tipo: 'recebimento',
    descricao: payload.descricao || 'Pagamento rápido',
    valor: Number(payload.valor || 0),
    pessoa_id: payload.pessoa_id || null,
    tipo_movimento: payload.tipo_movimento || 'Quota',
    estado_validacao: 'rascunho'
  };

  return CNE.workflowsContexto.applySessao(row);
};

CNE.workflowsContexto.novaAtividade = function novaAtividade(payload) {
  const atividade = payload || {};

  return CNE.workflowsContexto.applySessao({
    id: crypto.randomUUID(),
    nome: atividade.nome || '',
    tipo: atividade.tipo || 'Atividade',
    estado: 'aberta'
  });
};

CNE.workflowsContexto.contagemRapida = function contagemRapida(payload) {
  return CNE.workflowsContexto.applySessao(Object.assign({
    id: crypto.randomUUID(),
    tipo: 'contagem',
    observacoes: 'Contagem rápida'
  }, payload || {}));
};

CNE.workflowsContexto.renderSessaoResumo = function renderSessaoResumo(selector) {
  const container = document.querySelector(selector || '#sessaoResumo');

  if (!container || !CNE.sessao) return;

  const sessao = CNE.sessao.current();

  container.innerHTML = ''
    + '<div class="sessao-resumo">'
    + '<strong>' + (sessao.nome || 'Sessão') + '</strong>'
    + '<span>' + (sessao.secao || '') + '</span>'
    + '<span>' + (sessao.data_operacao || '') + '</span>'
    + '</div>';
};

window.addEventListener('load', function(){
  CNE.workflowsContexto.renderSessaoResumo();
});