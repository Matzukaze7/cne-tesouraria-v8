window.CNE = window.CNE || {};

CNE.relatorioCache = CNE.relatorioCache || {};

CNE.relatorioCache.store = new Map();

CNE.relatorioCache.hash = function hash(payload = {}) {
  try {
    return JSON.stringify(payload);
  } catch {
    return crypto.randomUUID();
  }
};

CNE.relatorioCache.get = function get(key, payload = {}) {
  const hash = `${key}:${CNE.relatorioCache.hash(payload)}`;
  return CNE.relatorioCache.store.get(hash);
};

CNE.relatorioCache.set = function set(key, payload = {}, value = null) {
  const hash = `${key}:${CNE.relatorioCache.hash(payload)}`;

  CNE.relatorioCache.store.set(hash, {
    value,
    created_at: Date.now()
  });

  return value;
};

CNE.relatorioCache.memo = function memo(key, payload = {}, generator = () => null) {
  const cached = CNE.relatorioCache.get(key, payload);

  if (cached) return cached.value;

  const value = generator();

  return CNE.relatorioCache.set(key, payload, value);
};

CNE.relatorioCache.clear = function clear(prefix = '') {
  if (!prefix) {
    CNE.relatorioCache.store.clear();
    return;
  }

  [...CNE.relatorioCache.store.keys()].forEach(key => {
    if (key.startsWith(prefix)) {
      CNE.relatorioCache.store.delete(key);
    }
  });
};

CNE.relatorioCache.totais = function totais(rows = []) {
  return CNE.relatorioCache.memo('totais', {
    size: rows.length,
    ids: rows.map(r => r.id)
  }, () => {
    const recebimentos = rows
      .filter(r => String(r.tipo || '').toLowerCase() === 'recebimento')
      .reduce((sum, r) => sum + Number(r.valor || 0), 0);

    const pagamentos = rows
      .filter(r => String(r.tipo || '').toLowerCase() === 'pagamento')
      .reduce((sum, r) => sum + Number(r.valor || 0), 0);

    return {
      recebimentos,
      pagamentos,
      liquido: recebimentos - pagamentos
    };
  });
};

window.addEventListener('beforeunload', () => {
  CNE.relatorioCache.clear();
});