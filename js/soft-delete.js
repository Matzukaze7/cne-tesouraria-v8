window.CNE = window.CNE || {};

CNE.softDelete = CNE.softDelete || {};

CNE.softDelete.markDeleted = function markDeleted(row = {}, user = 'sistema') {
  return {
    ...row,
    deleted_at: new Date().toISOString(),
    deleted_by: user,
    ativo: false
  };
};

CNE.softDelete.restore = function restore(row = {}) {
  return {
    ...row,
    deleted_at: null,
    deleted_by: null,
    ativo: true
  };
};

CNE.softDelete.isDeleted = function isDeleted(row = {}) {
  return Boolean(row.deleted_at);
};

CNE.softDelete.filterActive = function filterActive(rows = []) {
  return rows.filter(row => !CNE.softDelete.isDeleted(row));
};

CNE.softDelete.recycleBinSummary = function recycleBinSummary(rows = []) {
  const deleted = rows.filter(CNE.softDelete.isDeleted);

  return {
    total: deleted.length,
    latest: deleted.slice(-10)
  };
};