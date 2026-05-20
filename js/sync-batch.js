window.CNE = window.CNE || {};

CNE.syncBatch = CNE.syncBatch || {};

CNE.syncBatch.STATUS = {
  PENDING: 'pending',
  SYNCING: 'syncing',
  SYNCED: 'synced',
  ERROR: 'error',
  CONFLICT: 'conflict'
};

CNE.syncBatch.chunk = function chunk(items = [], size = 20) {
  const chunks = [];

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }

  return chunks;
};

CNE.syncBatch.markStatus = function markStatus(item = {}, status = 'pending', extra = {}) {
  return {
    ...item,
    sync_status: status,
    sync_updated_at: new Date().toISOString(),
    ...extra
  };
};

CNE.syncBatch.processBatch = async function processBatch(batch = [], handler = async () => {}) {
  const results = [];

  for (const item of batch) {
    try {
      const syncing = CNE.syncBatch.markStatus(item, CNE.syncBatch.STATUS.SYNCING);
      const result = await handler(syncing);

      results.push(
        CNE.syncBatch.markStatus(result || syncing, CNE.syncBatch.STATUS.SYNCED)
      );
    } catch (error) {
      console.error('Erro sync batch', error);

      results.push(
        CNE.syncBatch.markStatus(item, CNE.syncBatch.STATUS.ERROR, {
          sync_error: String(error)
        })
      );
    }
  }

  return results;
};

CNE.syncBatch.retryErrored = function retryErrored(queue = []) {
  return queue.map(item => {
    if (item.sync_status !== CNE.syncBatch.STATUS.ERROR) return item;

    return CNE.syncBatch.markStatus(item, CNE.syncBatch.STATUS.PENDING, {
      sync_error: null
    });
  });
};

CNE.syncBatch.summary = function summary(queue = []) {
  const statuses = Object.values(CNE.syncBatch.STATUS);

  return statuses.reduce((acc, status) => {
    acc[status] = queue.filter(item => item.sync_status === status).length;
    return acc;
  }, {});
};