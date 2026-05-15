window.CNE = window.CNE || {};

CNE.statusUI = {
  current: 'online'
};

CNE.setStatus = function setStatus(status = 'online') {
  CNE.statusUI.current = status;

  const badge = document.getElementById('syncStatus');
  if (!badge) return;

  const labels = {
    online: 'Online',
    offline: 'Offline',
    syncing: 'A sincronizar',
    local: 'Guardado localmente'
  };

  badge.className = `status-badge ${status}`;
  badge.textContent = labels[status] || status;
};

window.addEventListener('online', () => {
  CNE.setStatus('syncing');

  setTimeout(() => {
    CNE.setStatus('online');
  }, 1200);
});

window.addEventListener('offline', () => {
  CNE.setStatus('offline');
});

window.addEventListener('load', () => {
  CNE.setStatus(navigator.onLine ? 'online' : 'offline');
});