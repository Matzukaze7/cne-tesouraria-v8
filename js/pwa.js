window.CNE = window.CNE || {};

CNE.installPWA = async function installPWA() {
  if (!('serviceWorker' in navigator)) return false;

  try {
    const registration = await navigator.serviceWorker.register('./service-worker.js');
    console.info('CNE PWA ativo', registration.scope);
    return registration;
  } catch (error) {
    console.warn('Falha registo PWA', error);
    return false;
  }
};

window.addEventListener('load', () => {
  CNE.installPWA();
});