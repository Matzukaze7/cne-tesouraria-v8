window.CNE = window.CNE || {};

CNE.entityManagement = CNE.entityManagement || {};

CNE.entityManagement.ensureFlags = function ensureFlags(entity = {}) {
  return {
    archived: false,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...entity
  };
};

CNE.entityManagement.editEntity = function editEntity(entity = {}, updates = {}) {
  return {
    ...entity,
    ...updates,
    updated_at: new Date().toISOString()
  };
};

CNE.entityManagement.archiveEntity = function archiveEntity(entity = {}) {
  return {
    ...entity,
    archived: true,
    active: false,
    archived_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

CNE.entityManagement.restoreEntity = function restoreEntity(entity = {}) {
  return {
    ...entity,
    archived: false,
    active: true,
    restored_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

CNE.entityManagement.renderActions = function renderActions(entityId = '') {
  return `
    <div class="entity-actions">
      <button class="btn-small" data-edit-entity="${entityId}">
        Editar
      </button>

      <button class="btn-small secondary" data-archive-entity="${entityId}">
        Arquivar
      </button>

      <button class="btn-small success" data-restore-entity="${entityId}">
        Reativar
      </button>
    </div>
  `;
};

CNE.entityManagement.quickRename = function quickRename(entity = {}) {
  const novoNome = prompt('Novo nome', entity.nome || entity.name || '');

  if (!novoNome) return entity;

  return CNE.entityManagement.editEntity(entity, {
    nome: novoNome
  });
};

CNE.entityManagement.safeRemoveFromUI = function safeRemoveFromUI(selector = '', id = '') {
  const row = document.querySelector(`${selector} [data-row-id="${id}"]`);

  if (!row) return;

  row.style.opacity = '0.5';
  row.dataset.archived = 'true';
};

window.addEventListener('click', event => {
  const edit = event.target.closest?.('[data-edit-entity]');
  const archive = event.target.closest?.('[data-archive-entity]');
  const restore = event.target.closest?.('[data-restore-entity]');

  if (edit) {
    console.log('Editar entidade', edit.dataset.editEntity);
  }

  if (archive) {
    console.log('Arquivar entidade', archive.dataset.archiveEntity);
  }

  if (restore) {
    console.log('Reativar entidade', restore.dataset.restoreEntity);
  }
});