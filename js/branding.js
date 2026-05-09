window.CNE = window.CNE || {};

CNE.resolveBrandingScope = function resolveBrandingScope(context = {}) {
  const tipo = context.tipo || '';
  const secao = context.secao || context.secao_origem || 'Agrupamento';
  const ambito = context.ambito || context.conta_financeira || '';

  if (ambito === 'agrupamento') return 'Agrupamento';
  if (tipo === 'trimestre' && context.relScope === 'Agrupamento') return 'Agrupamento';
  if (tipo === 'atividade' && context.atividade?.conta_financeira === 'agrupamento') return 'Agrupamento';
  if (tipo === 'pessoa' && context.pessoa?.secao) return context.pessoa.secao;

  return secao;
};

CNE.officialMark = function officialMark(sec = 'Agrupamento') {
  const colors = CNE.cores || {
    Agrupamento: '#1E6042',
    Alcateia: '#F2C94C',
    Expedição: '#2B966C',
    Comunidade: '#155E75',
    Clã: '#BD242C'
  };
  const c = colors[sec] || colors.Agrupamento;

  const title = sec === 'Agrupamento'
    ? ['AGRUP. 276', 'SANTA CRUZ DO BISPO', 'CORPO NACIONAL DE ESCUTAS']
    : [String(sec).toUpperCase(), '', ''];

  return `<svg class="brand-svg" viewBox="0 0 430 110" preserveAspectRatio="xMinYMid meet" xmlns="http://www.w3.org/2000/svg">
    <circle cx="45" cy="45" r="34" fill="${c}" opacity=".95"/>
    <path d="M45 12 C35 25 30 36 32 47 C23 42 14 45 9 54 C22 51 30 54 35 63 C33 75 25 86 16 94 C31 94 41 87 45 75 C49 87 59 94 74 94 C65 86 57 75 55 63 C60 54 68 51 81 54 C76 45 67 42 58 47 C60 36 55 25 45 12 Z" fill="#fff"/>
    <path d="M24 58 H66 M45 39 V82" stroke="#BD242C" stroke-width="8" stroke-linecap="round"/>
    <text x="100" y="37" font-size="22" font-weight="900" fill="${c}">${title[0]}</text>
    <text x="100" y="63" font-size="18" font-weight="900" fill="${c}">${title[1]}</text>
    <text x="100" y="84" font-size="11" fill="#2B966C" letter-spacing="2">${title[2]}</text>
  </svg>`;
};

CNE.logoHtml = function logoHtml(sec = 'Agrupamento') {
  const config = CNE.state?.config || { brandMode: {}, images: {} };
  const mode = config.brandMode?.[sec] || 'oficial';
  const img = config.images?.[sec];

  if (mode === 'upload' && img) return `<img class="brand" src="${img}" alt="Imagem ${sec}">`;
  if (mode === 'nenhuma') return '<div></div>';

  return CNE.officialMark(sec);
};

CNE.setSecColor = function setSecColor(sec = 'Agrupamento') {
  const colors = CNE.cores || { Agrupamento: '#1E6042' };
  document.documentElement.style.setProperty('--sec', colors[sec] || colors.Agrupamento);
};

CNE.reportHeader = function reportHeader(title, subtitle, sec = 'Agrupamento') {
  CNE.setSecColor(sec);
  return `<div class="report"><div class="rhead"><div>${CNE.logoHtml(sec)}</div><div><h1>${CNE.esc(title)}</h1><h2>${CNE.esc(subtitle || '')}</h2></div><div class="stamp"><b>Corpo Nacional de Escutas</b><br>${CNE.esc(sec)}<br>${new Date().toLocaleDateString('pt-PT')}</div></div>`;
};