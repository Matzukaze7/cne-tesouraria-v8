window.CNE = window.CNE || {};

CNE.auditoria = {
  eventos: []
};

CNE.auditEvent = async function auditEvent(tipo, detalhes = {}) {
  const row = {
    id: crypto.randomUUID(),
    tipo,
    detalhes,
    created_at: new Date().toISOString()
  };

  try {
    await CNE.db.from('auditoria').insert(row);
  } catch (error) {
    console.warn('Falha auditoria remota', error);
  }

  CNE.auditoria.eventos.unshift(row);
  return row;
};

CNE.snapshotResumo = function snapshotResumo() {
  return {
    ano_escutista: CNE.anoEscutista(),
    pessoas: CNE.state.pessoas?.length || 0,
    atividades: CNE.state.atividades?.length || 0,
    movimentos: CNE.state.movimentos?.length || 0,
    presencas: CNE.state.presencas?.length || 0,
    timestamp: new Date().toISOString()
  };
};