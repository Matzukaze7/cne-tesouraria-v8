window.CNE = window.CNE || {};

CNE.syncQueue = {
  processing: false
};

CNE.queueOperation = async function queueOperation(operation = {}) {
  const row = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    status: 'pending',
    ...operation
  };

  await CNE.idbPut('queue', row);
  return row;
};

CNE.getPendingQueue = async function getPendingQueue() {
  const items = await CNE.idbGetAll('queue');
  return items.filter(item => item.status === 'pending');
};

CNE.processQueue = async function processQueue() {
  if (CNE.syncQueue.processing || !navigator.onLine) return;

  CNE.syncQueue.processing = true;

  try {
    const pending = await CNE.getPendingQueue();

    for (const item of pending) {
      try {
        if (item.table && item.payload) {
          const response = await CNE.db
            .from(item.table)
            .upsert(item.payload);

          if (response.error) throw response.error;
        }

        item.status = 'synced';
        await CNE.idbPut('queue', item);
      } catch (error) {
        console.warn('Falha sincronização pendente', error);
      }
    }
  } finally {
    CNE.syncQueue.processing = false;
  }
};

window.addEventListener('online', () => {
  CNE.processQueue();
});