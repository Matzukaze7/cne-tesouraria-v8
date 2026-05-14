window.CNE = window.CNE || {};

CNE.githubPages = {
  isGithubPages: location.hostname.includes('github.io')
};

CNE.basePath = function basePath() {
  if (!CNE.githubPages.isGithubPages) return './';

  const segments = location.pathname.split('/').filter(Boolean);
  return segments.length ? `/${segments[0]}/` : './';
};

CNE.resolveAsset = function resolveAsset(path = '') {
  const clean = path.replace(/^\.\//, '');
  return `${CNE.basePath()}${clean}`;
};

CNE.registerGithubPagesNotice = function registerGithubPagesNotice() {
  if (!CNE.githubPages.isGithubPages) return;

  console.info('CNE Tesouraria v8 em modo GitHub Pages');
};

window.addEventListener('load', () => {
  CNE.registerGithubPagesNotice();
});