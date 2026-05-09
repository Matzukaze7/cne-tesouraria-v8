window.CNE = window.CNE || {};

CNE.configuracoes = {
  imagemTemp: null
};

CNE.renderConfiguracoes = function renderConfiguracoes() {
  const root = CNE.$('configuracoesRoot');
  if (!root) return;

  root.innerHTML = `
    <div class="card no-print">
      <h1>Configurações CNE Tesouraria</h1>
      <p class="muted">Configurações persistentes partilhadas por todos os utilizadores/dispositivos via Supabase.</p>
      <div class="grid">
        <div>
          <label>Âmbito</label>
          <select id="cfgScope"></select>
        </div>
        <div>
          <label>Caixa inicial</label>
          <input id="cfgCaixa" type="number" step="0.01" value="0">
        </div>
        <div>
          <label>Banco inicial</label>
          <input id="cfgBanco" type="number" step="0.01" value="0">
        </div>
        <div>
          <label>Data de referência</label>
          <input id="cfgData" type="date">
        </div>
        <div>
          <label>Modo de imagem/branding</label>
          <select id="cfgBrandMode">
            <option value="oficial">Oficial predefinida</option>
            <option value="upload">Imagem carregada</option>
            <option value="nenhuma">Sem imagem</option>
          </select>
        </div>
        <div>
          <label>Imagem própria</label>
          <input id="cfgImg" type="file" accept="image/*">
        </div>
      </div>
      <label>Tipos SIIC editáveis</label>
      <textarea id="cfgTipos" placeholder="Um tipo por linha"></textarea>
      <button id="cfgSaveBtn">Guardar configurações</button>
      <p class="muted" id="cfgStatus"></p>
    </div>
    <div class="card">
      <h2>Pré-visualização de branding</h2>
      <div id="cfgBrandPreview" class="report"></div>
    </div>
  `;

  CNE.$('cfgScope').innerHTML = CNE.scopes.map(s => `<option>${CNE.esc(s)}</option>`).join('');
  CNE.$('cfgScope').addEventListener('change', CNE.syncConfiguracoesUI);
  CNE.$('cfgBrandMode').addEventListener('change', CNE.previewConfiguracoesBranding);
  CNE.$('cfgImg').addEventListener('change', CNE.handleConfiguracoesImagem);
  CNE.$('cfgSaveBtn').addEventListener('click', CNE.saveConfiguracoes);

  CNE.syncConfiguracoesUI();
};

CNE.syncConfiguracoesUI = function syncConfiguracoesUI() {
  const scope = CNE.$('cfgScope')?.value || 'Agrupamento';
  const saldos = CNE.state.config.saldos?.[scope] || { caixa: 0, banco: 0, data: '' };

  CNE.$('cfgCaixa').value = saldos.caixa || 0;
  CNE.$('cfgBanco').value = saldos.banco || 0;
  CNE.$('cfgData').value = saldos.data || '';
  CNE.$('cfgBrandMode').value = CNE.state.config.brandMode?.[scope] || 'oficial';
  CNE.$('cfgTipos').value = (CNE.state.config.tipos?.[scope] || []).join('\n');

  CNE.previewConfiguracoesBranding();
  CNE.updateConfiguracoesStatus('Configuração carregada.');
};

CNE.handleConfiguracoesImagem = function handleConfiguracoesImagem(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    CNE.configuracoes.imagemTemp = reader.result;
    CNE.$('cfgBrandMode').value = 'upload';
    CNE.previewConfiguracoesBranding();
    CNE.updateConfiguracoesStatus('Imagem carregada localmente. Guarda para sincronizar no Supabase.');
  };
  reader.readAsDataURL(file);
};

CNE.previewConfiguracoesBranding = function previewConfiguracoesBranding() {
  const scope = CNE.$('cfgScope')?.value || 'Agrupamento';
  const mode = CNE.$('cfgBrandMode')?.value || 'oficial';
  const preview = CNE.$('cfgBrandPreview');
  if (!preview) return;

  let html = '';
  if (mode === 'upload' && CNE.configuracoes.imagemTemp) {
    html = `<img class="brand" src="${CNE.configuracoes.imagemTemp}" alt="Pré-visualização ${CNE.esc(scope)}">`;
  } else if (mode === 'upload' && CNE.state.config.images?.[scope]) {
    html = `<img class="brand" src="${CNE.state.config.images[scope]}" alt="Imagem ${CNE.esc(scope)}">`;
  } else if (mode === 'nenhuma') {
    html = '<p class="muted">Sem imagem no relatório.</p>';
  } else {
    html = CNE.officialMark(scope);
  }

  preview.innerHTML = html;
};

CNE.updateConfiguracoesStatus = function updateConfiguracoesStatus(message = '') {
  const scope = CNE.$('cfgScope')?.value || 'Agrupamento';
  const saldos = CNE.state.config.saldos?.[scope] || { caixa: 0, banco: 0 };
  const status = CNE.$('cfgStatus');
  if (!status) return;

  status.textContent = `${message} ${scope} | Caixa ${CNE.euro(saldos.caixa || 0)} | Banco ${CNE.euro(saldos.banco || 0)} | imagem: ${CNE.state.config.brandMode?.[scope] || 'oficial'}`;
};

CNE.saveConfiguracoes = async function saveConfiguracoes() {
  const scope = CNE.$('cfgScope').value;
  const now = new Date().toISOString();
  const image = CNE.configuracoes.imagemTemp || CNE.state.config.images?.[scope] || null;

  const saldoRow = {
    id: CNE.idFor('saldo', scope),
    ambito: scope,
    caixa: Number(CNE.$('cfgCaixa').value || 0),
    banco: Number(CNE.$('cfgBanco').value || 0),
    data_referencia: CNE.$('cfgData').value || null,
    updated_at: now
  };

  const brandRow = {
    id: CNE.idFor('brand', scope),
    ambito: scope,
    modo: CNE.$('cfgBrandMode').value,
    imagem_data_url: image,
    updated_at: now
  };

  await CNE.db.from('saldos_iniciais').upsert(saldoRow);
  await CNE.db.from('branding_config').upsert(brandRow);
  await CNE.db.from('tipos_siic').update({ ativo: false, updated_at: now }).eq('ambito', scope);

  const tipos = CNE.$('cfgTipos').value
    .split('\n')
    .map(x => x.trim())
    .filter(Boolean)
    .map((nome, index) => ({
      id: CNE.idFor(`siic_${index}`, `${scope}_${nome}`),
      ambito: scope,
      nome,
      ativo: true,
      ordem: (index + 1) * 10,
      updated_at: now
    }));

  if (tipos.length) await CNE.db.from('tipos_siic').upsert(tipos);

  CNE.configuracoes.imagemTemp = null;
  await CNE.loadConfig();
  CNE.syncConfiguracoesUI();
  CNE.updateConfiguracoesStatus('Guardado no Supabase.');
};

CNE.initConfiguracoesPage = async function initConfiguracoesPage() {
  await CNE.loadConfig();
  CNE.renderConfiguracoes();
  CNE.subscribeRealtime(['saldos_iniciais', 'branding_config', 'tipos_siic'], async () => {
    await CNE.loadConfig();
    CNE.syncConfiguracoesUI();
  });
};