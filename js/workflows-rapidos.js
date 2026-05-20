window.CNE = window.CNE || {};

CNE.workflows = CNE.workflows || {};

CNE.workflows.acoes = [
  {
    id: 'nova_atividade',
    titulo: 'Nova atividade',
    descricao: 'Criar atividade com defaults inteligentes.'
  },
  {
    id: 'receber_pagamento',
    titulo: 'Receber pagamento',
    descricao: 'Registar pagamento rápido de participante.'
  },
  {
    id: 'contar_caixa',
    titulo: 'Contar caixa',
    descricao: 'Registar contagem de numerário.'
  },
  {
    id: 'gerar_relatorio',
    titulo: 'Gerar relatório',
    descricao: 'Criar relatório com filtros automáticos.'
  }
];

CNE.workflows.renderAcoesRapidas = function renderAcoesRapidas(selector = '#acoesRapidas') {
  const container = document.querySelector(selector);
  if (!container) return;

  container.innerHTML = CNE.workflows.acoes.map(acao => `
    <button class="quick-action" data-action="${acao.id}">
      <strong>${CNE.esc(acao.titulo)}</strong>
      <small>${CNE.esc(acao.descricao)}</small>
    </button>
  `).join('');
};

CNE.workflows.defaultAtividade = function defaultAtividade(secao = 'Agrupamento') {
  return CNE.createAtividadePayload({
    nome: '',
    secao,
    ambito: secao === 'Agrupamento' ? 'agrupamento' : 'secao',
    data_inicio: new Date().toISOString().slice(0, 10),
    valor_padrao: 0,
    estado: 'aberta'
  });
};

CNE.workflows.pagamentoRapido = function pagamentoRapido({
  pessoaId,
  atividade,
  valor
} = {}) {
  if (!pessoaId || !atividade) {
    throw new Error('Pessoa e atividade são obrigatórias para pagamento rápido.');
  }

  const row = CNE.createRecebimentoAtividadePayload
    ? CNE.createRecebimentoAtividadePayload(pessoaId, atividade, valor)
    : {
        id: crypto.randomUUID(),
        pessoa_id: pessoaId,
        atividade_id: atividade.id,
        tipo: 'recebimento',
        tipo_movimento: atividade.tipo || '',
        valor: Number(valor || atividade.valor_padrao || 0),
        estado_validacao: 'rascunho',
        secao_origem: atividade.secao_origem || atividade.secao,
        conta_financeira: atividade.conta_financeira || 'secao'
      };

  return CNE.dedupe?.markFingerprint
    ? CNE.dedupe.markFingerprint(row)
    : row;
};

CNE.workflows.contagemRapida = function contagemRapida(secao = 'Agrupamento') {
  return CNE.createContagemPayload({
    secao,
    notas: {},
    moedas: {},
    observacoes: 'Contagem rápida'
  });
};

CNE.workflows.handleAction = function handleAction(actionId = '') {
  switch (actionId) {
    case 'nova_atividade':
      return CNE.workflows.defaultAtividade();

    case 'contar_caixa':
      return CNE.workflows.contagemRapida();

    case 'gerar_relatorio':
      location.href = 'relatorios.html';
      return null;

    default:
      return null;
  }
};

window.addEventListener('click', event => {
  const button = event.target.closest?.('[data-action]');
  if (!button) return;

  const result = CNE.workflows.handleAction(button.dataset.action);

  if (result && CNE.auditEvent) {
    CNE.auditEvent('workflow_rapido', {
      action: button.dataset.action,
      result
    });
  }
});