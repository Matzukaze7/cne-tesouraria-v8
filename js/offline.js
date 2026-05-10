window.CNE = window.CNE || {};

CNE.connection = {
  online: navigator.onLine,
  pendingChanges: false,
  lastSavedOfflineAt: null,
  storageKey: 'cne_tesouraria_offline_snapshot'
};

CNE.setPendingChanges = function setPendingChanges(value = true) {
  CNE.connection.pendingChanges = Boolean(value);
  CNE.updateConnectionBadge();
};

CNE.saveOfflineSnapshot = function saveOfflineSnapshot(reason = 'manual') {
  const snapshot = {
    saved_at: new Date().toISOString(),
    reason,
    state: CNE.state || {}
  };

  localStorage.setItem(CNE.connection.storageKey, JSON.stringify(snapshot));
  CNE.connection.lastSavedOfflineAt = snapshot.saved_at;
  CNE.connection.pendingChanges = false;
  CNE.updateConnectionBadge();

  return snapshot;
};

CNE.loadOfflineSnapshot = function loadOfflineSnapshot() {
  const raw = localStorage.getItem(CNE.connection.storageKey);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Não foi possível ler dados offline guardados.', error);
    return null;
  }
};

CNE.updateConnectionBadge = function updateConnectionBadge() {
  let badge = document.getElementById('connectionStatus');

  if (!badge) {
    badge = document.createElement('div');
    badge.id = 'connectionStatus';
    badge.className = 'connection-status no-print';
    document.body.appendChild(badge);
  }

  const online = navigator.onLine;
  CNE.connection.online = online;

  if (online && !CNE.connection.pendingChanges) {
    badge.textContent = 'Online';
    badge.className = 'connection-status online no-print';
    badge.title = 'Ligação ativa.';
    return;
  }

  if (online && CNE.connection.pendingChanges) {
    badge.textContent = 'Online · alterações por sincronizar';
    badge.className = 'connection-status pending no-print';
    badge.title = 'Existem alterações locais ainda não confirmadas.';
    return;
  }

  badge.textContent = CNE.connection.pendingChanges ? 'Offline · alterações por guardar' : 'Offline';
  badge.className = CNE.connection.pendingChanges ? 'connection-status offline pending no-print' : 'connection-status offline no-print';
  badge.title = 'Sem ligação. Pode continuar a trabalhar, mas confirme a gravação offline antes de sair.';
};

CNE.installOfflineExitGuard = function installOfflineExitGuard() {
  window.addEventListener('online', CNE.updateConnectionBadge);
  window.addEventListener('offline', CNE.updateConnectionBadge);

  document.addEventListener('input', event => {
    const target = event.target;
    if (!target) return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) CNE.setPendingChanges(true);
  }, true);

  window.addEventListener('beforeunload', event => {
    if (navigator.onLine && !CNE.connection.pendingChanges) return;

    try {
      CNE.saveOfflineSnapshot(navigator.onLine ? 'pending_before_exit' : 'offline_before_exit');
    } catch (error) {
      console.warn('Não foi possível guardar snapshot offline automaticamente.', error);
    }

    event.preventDefault();
    event.returnValue = 'Existem dados offline ou alterações por sincronizar. Foram guardados localmente neste dispositivo, mas confirma que pretende sair?';
    return event.returnValue;
  });

  CNE.updateConnectionBadge();
};

CNE.installOfflineExitGuard();