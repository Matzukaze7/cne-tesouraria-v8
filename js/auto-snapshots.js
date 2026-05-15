window.CNE = window.CNE || {};

CNE.snapshots = {
  interval: null,
  lastHash: ''
};

CNE.generateStateHash = function generateStateHash() {
  try {
    return JSON.stringify({
      pessoas: CNE.state?.pessoas?.length || 0,
      atividades: CNE.state?.atividades?.length || 0,
      movimentos: CNE.state?.movimentos?.length || 0,
      presencas: CNE.state?.presencas?.length || 0,
      updated: Date.now().toString().slice(0, -4)
    });
  } catch {
    return crypto.randomUUID();
  }
};

CNE.autoSnapshotTick = async function autoSnapshotTick() {
  const hash = CNE.generateStateHash();

  if (hash === CNE.snapshots.lastHash) return;

  CNE.snapshots.lastHash = hash;

  try {
    await CNE.saveOfflineSnapshot();
    console.info('Snapshot offline guardado');
  } catch (error) {
    console.warn('Falha snapshot offline', error);
  }
};

CNE.startAutoSnapshots = function startAutoSnapshots(minutes = 2) {
  if (CNE.snapshots.interval) {
    clearInterval(CNE.snapshots.interval);
  }

  CNE.snapshots.interval = setInterval(() => {
    CNE.autoSnapshotTick();
  }, minutes * 60 * 1000);

  CNE.autoSnapshotTick();
};

window.addEventListener('load', () => {
  CNE.startAutoSnapshots();
});