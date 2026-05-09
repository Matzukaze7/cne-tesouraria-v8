const CNE_SUPABASE_URL = 'https://ebyovpnqlgjrseudaqet.supabase.co';
const CNE_SUPABASE_KEY = 'sb_publishable_umMHXkrCZk-VM2oKncUjAg_zqx_NDUN';
const db = supabase.createClient(CNE_SUPABASE_URL, CNE_SUPABASE_KEY);

const CNE_SECOES = ['Alcateia', 'Expedição', 'Comunidade', 'Clã'];
const CNE_SCOPES = ['Agrupamento', ...CNE_SECOES];
const CNE_CORES = {
  Agrupamento: '#1E6042',
  Alcateia: '#F2C94C',
  Expedição: '#2B966C',
  Comunidade: '#155E75',
  Clã: '#BD242C'
};

const CNE_STATE = {
  pessoas: [],
  atividades: [],
  movimentos: [],
  presencas: [],
  config: { saldos: {}, images: {}, brandMode: {}, tipos: {} }
};

function $(id) { return document.getElementById(id); }
function euro(v) { return Number(v || 0).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' }); }
function esc(s) { return String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
function idFor(prefix, s) {
  return prefix + '_' + String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ç/g, 'c').replace(/ã/g, 'a').replace(/[^a-z0-9_]+/g, '_');
}

async function cneLoadConfig() {
  CNE_STATE.config = { saldos: {}, images: {}, brandMode: {}, tipos: {} };
  const [saldos, brand, tipos] = await Promise.all([
    db.from('saldos_iniciais').select('*'),
    db.from('branding_config').select('*'),
    db.from('tipos_siic').select('*').eq('ativo', true).order('ordem', { ascending: true })
  ]);
  (saldos.data || []).forEach(r => CNE_STATE.config.saldos[r.ambito] = { caixa: Number(r.caixa || 0), banco: Number(r.banco || 0), data: r.data_referencia || '' });
  (brand.data || []).forEach(r => { CNE_STATE.config.brandMode[r.ambito] = r.modo || 'oficial'; if (r.imagem_data_url) CNE_STATE.config.images[r.ambito] = r.imagem_data_url; });
  (tipos.data || []).forEach(r => { (CNE_STATE.config.tipos[r.ambito] ||= []).push(r.nome); });
}

async function cneLoadData(extraTables = []) {
  await cneLoadConfig();
  for (const t of ['pessoas', 'atividades', 'movimentos', 'presencas', ...extraTables]) {
    const r = await db.from(t).select('*');
    CNE_STATE[t] = r.data || [];
  }
}

function cneSubscribe(tables, callback) {
  tables.forEach(t => db.channel('cne_' + t).on('postgres_changes', { event: '*', schema: 'public', table: t }, callback).subscribe());
}

function setSecColor(sec) { document.documentElement.style.setProperty('--sec', CNE_CORES[sec] || CNE_CORES.Agrupamento); }
function officialMark(sec) {
  const c = CNE_CORES[sec] || CNE_CORES.Agrupamento;
  const t = sec === 'Agrupamento' ? ['AGRUP. 276', 'SANTA CRUZ DO BISPO', 'CORPO NACIONAL DE ESCUTAS'] : [sec.toUpperCase(), '', ''];
  return `<svg class="brand-svg" viewBox="0 0 430 110" preserveAspectRatio="xMinYMid meet" xmlns="http://www.w3.org/2000/svg"><circle cx="45" cy="45" r="34" fill="${c}" opacity=".95"/><path d="M45 12 C35 25 30 36 32 47 C23 42 14 45 9 54 C22 51 30 54 35 63 C33 75 25 86 16 94 C31 94 41 87 45 75 C49 87 59 94 74 94 C65 86 57 75 55 63 C60 54 68 51 81 54 C76 45 67 42 58 47 C60 36 55 25 45 12 Z" fill="#fff"/><path d="M24 58 H66 M45 39 V82" stroke="#BD242C" stroke-width="8" stroke-linecap="round"/><text x="100" y="37" font-size="22" font-weight="900" fill="${c}">${t[0]}</text><text x="100" y="63" font-size="18" font-weight="900" fill="${c}">${t[1]}</text><text x="100" y="84" font-size="11" fill="#2B966C" letter-spacing="2">${t[2]}</text></svg>`;
}
function logoHtml(sec) {
  const mode = CNE_STATE.config.brandMode[sec] || 'oficial';
  const img = CNE_STATE.config.images[sec];
  if (mode === 'upload' && img) return `<img class="brand" src="${img}">`;
  if (mode === 'nenhuma') return '<div></div>';
  return officialMark(sec);
}

window.CNE = { db, state: CNE_STATE, secoes: CNE_SECOES, scopes: CNE_SCOPES, cores: CNE_CORES, loadConfig: cneLoadConfig, loadData: cneLoadData, subscribe: cneSubscribe, $, euro, esc, idFor, setSecColor, logoHtml };