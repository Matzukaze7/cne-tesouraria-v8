window.CNE = window.CNE || {};

CNE.idb = {
  dbName: 'cne_tesouraria_v8',
  version: 1,
  stores: ['snapshots', 'queue', 'config']
};

CNE.openIDB = function openIDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(CNE.idb.dbName, CNE.idb.version);

    request.onupgradeneeded = event => {
      const db = event.target.result;

      CNE.idb.stores.forEach(store => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: 'id' });
        }
      });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

CNE.idbPut = async function idbPut(store, value) {
  const db = await CNE.openIDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).put(value);

    tx.oncomplete = () => resolve(value);
    tx.onerror = () => reject(tx.error);
  });
};

CNE.idbGetAll = async function idbGetAll(store) {
  const db = await CNE.openIDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const request = tx.objectStore(store).getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

CNE.saveOfflineSnapshot = async function saveOfflineSnapshot() {
  const snapshot = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    ano_escutista: CNE.anoEscutista?.() || '',
    state: {
      pessoas: CNE.state?.pessoas || [],
      atividades: CNE.state?.atividades || [],
      movimentos: CNE.state?.movimentos || [],
      presencas: CNE.state?.presencas || []
    }
  };

  return CNE.idbPut('snapshots', snapshot);
};