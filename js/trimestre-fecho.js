window.CNE = window.CNE || {};

CNE.trimestreFecho = CNE.trimestreFecho || {};

CNE.trimestreFecho.createSnapshot = function createSnapshot(payload = {}) {
  return {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    ano_escutista: payload.ano_escutista || CNE.anoEscutista?.() || '',
    trimestre: payload.trimestre || '',
    secao: payload.secao || 'Agrupamento',
    branding: structuredClone(CNE.state?.branding || {}),
    totais: structuredClone(payload.totais || {}),
    movimentos: structuredClone(payload.movimentos || []),
    estado: 'fechado'
  };
};

CNE.trimestreFecho.freezeMovimentos = function freezeMovimentos(rows = []) {
  return rows.map(row => ({
    ...row,
    trimestre_fechado: true,
    snapshot_locked_at: new Date().toISOString()
  }));
};

CNE.trimestreFecho.isLocked = function isLocked(row = {}) {
  return Boolean(row.trimestre_fechado);
};