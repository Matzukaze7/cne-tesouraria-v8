window.CNE = window.CNE || {};

CNE.dedupe = CNE.dedupe || {};

CNE.dedupe.normalizeDate = function normalizeDate(value = '') {
  if (!value) return new Date().toISOString().slice(0, 10);
  return String(value).slice(0, 10);
};

CNE.dedupe.fingerprintMovimento = function fingerprintMovimento(row = {}) {
  return [
    row.pessoa_id || 'sem_pessoa',
    row.atividade_id || 'sem_atividade',
    row.tipo || 'sem_tipo',
    row.tipo_movimento || 'sem_siic',
    Number(row.valor || 0).toFixed(2),
    CNE.dedupe.normalizeDate(row.data_operacao || row.created_at)
  ].join('|');
};

CNE.dedupe.findPotentialDuplicate = function findPotentialDuplicate(row = {}, movimentos = CNE.state?.movimentos || []) {
  const fp = CNE.dedupe.fingerprintMovimento(row);
  return movimentos.find(mov => CNE.dedupe.fingerprintMovimento(mov) === fp && mov.id !== row.id) || null;
};

CNE.dedupe.assertNoDuplicate = function assertNoDuplicate(row = {}, movimentos = CNE.state?.movimentos || []) {
  const duplicate = CNE.dedupe.findPotentialDuplicate(row, movimentos);

  if (!duplicate) return { ok: true, duplicate: null };

  return {
    ok: false,
    duplicate,
    message: 'Possível movimento duplicado: mesma pessoa, atividade, tipo, valor e data.'
  };
};

CNE.dedupe.markFingerprint = function markFingerprint(row = {}) {
  return {
    ...row,
    dedupe_key: CNE.dedupe.fingerprintMovimento(row)
  };
};