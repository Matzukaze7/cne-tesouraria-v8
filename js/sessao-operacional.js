window.CNE = window.CNE || {};

CNE.sessao = CNE.sessao || {};

CNE.sessao.KEY = 'cne_sessao_operacional';

CNE.sessao.current = function current() {
  try {
    return JSON.parse(window.localStorage.getItem(CNE.sessao.KEY) || '{}');
  } catch (e) {
    return {};
  }
};

CNE.sessao.save = function save(payload) {
  const merged = Object.assign({}, CNE.sessao.current(), payload || {}, {
    updated_at: new Date().toISOString()
  });

  window.localStorage.setItem(CNE.sessao.KEY, JSON.stringify(merged));

  return merged;
};

CNE.sessao.create = function create(options) {
  const payload = options || {};

  return CNE.sessao.save({
    id: crypto.randomUUID(),
    nome: payload.nome || 'Sessão Operacional',
    secao: payload.secao || 'Agrupamento',
    conta_financeira: payload.conta_financeira || 'caixa',
    atividade_id: payload.atividade_id || null,
    data_operacao: new Date().toISOString().slice(0, 10),
    ativa: true
  });
};

CNE.sessao.applyDefaults = function applyDefaults(payload) {
  const sessao = CNE.sessao.current();
  const row = payload || {};

  return Object.assign({}, row, {
    secao_origem: row.secao_origem || sessao.secao || 'Agrupamento',
    atividade_id: row.atividade_id || sessao.atividade_id || null,
    conta_financeira: row.conta_financeira || sessao.conta_financeira || 'caixa',
    data_operacao: row.data_operacao || sessao.data_operacao || new Date().toISOString().slice(0, 10)
  });
};

CNE.sessao.renderBanner = function renderBanner(selector) {
  const container = document.querySelector(selector || '#sessaoOperacional');
  if (!container) return;

  const sessao = CNE.sessao.current();

  if (!sessao.ativa) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = '<div class="sessao-banner">'
    + '<strong>' + (sessao.nome || 'Sessão ativa') + '</strong>'
    + '<span>' + (sessao.secao || '') + '</span>'
    + '<span>' + (sessao.conta_financeira || '') + '</span>'
    + '<span>' + (sessao.data_operacao || '') + '</span>'
    + '</div>';
};

window.addEventListener('load', function(){
  if (!CNE.sessao.current().ativa) {
    CNE.sessao.create({
      nome: 'Reunião atual',
      secao: 'Clã',
      conta_financeira: 'caixa'
    });
  }

  CNE.sessao.renderBanner();
});