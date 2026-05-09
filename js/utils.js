window.CNE = window.CNE || {};

CNE.$ = CNE.$ || function $(id) { return document.getElementById(id); };

CNE.euro = CNE.euro || function euro(value) {
  return Number(value || 0).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
};

CNE.esc = CNE.esc || function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
};

CNE.idFor = CNE.idFor || function idFor(prefix, value) {
  return prefix + '_' + String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ç/g, 'c')
    .replace(/ã/g, 'a')
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '');
};

CNE.debounce = function debounce(fn, delay = 180) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

CNE.sumBy = function sumBy(rows, selector) {
  return rows.reduce((total, row) => total + Number(selector(row) || 0), 0);
};

CNE.groupBy = function groupBy(rows, selector) {
  return rows.reduce((acc, row) => {
    const key = selector(row) || 'Sem classificação';
    (acc[key] ||= []).push(row);
    return acc;
  }, {});
};

CNE.dateOnly = function dateOnly(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
};