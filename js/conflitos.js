window.CNE = window.CNE || {};

CNE.conflitos = CNE.conflitos || {};

CNE.conflitos.createVersionMeta = function createVersionMeta(row = {}, user = 'sistema') {
  return {
    ...row,
    version: Number(row.version || 0) + 1,
    updated_at: new Date().toISOString(),
    updated_by: user
  };
};

CNE.conflitos.hasConflict = function hasConflict(local = {}, remote = {}) {
  return Number(local.version || 0) < Number(remote.version || 0);
};

CNE.conflitos.describeConflict = function describeConflict(local = {}, remote = {}) {
  return {
    conflito: true,
    local_version: local.version || 0,
    remote_version: remote.version || 0,
    remote_updated_by: remote.updated_by || 'desconhecido',
    remote_updated_at: remote.updated_at || null
  };
};

CNE.conflitos.mergePresenca = function mergePresenca(local = {}, remote = {}) {
  const localTime = new Date(local.updated_at || 0).getTime();
  const remoteTime = new Date(remote.updated_at || 0).getTime();

  return remoteTime >= localTime ? remote : local;
};