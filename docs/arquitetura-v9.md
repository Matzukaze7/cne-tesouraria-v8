# Arquitetura v9 — CNE Tesouraria

## Objetivo

Evoluir a app de um ficheiro HTML único para uma aplicação organizada, mantendo:

- simplicidade para utilizadores;
- funcionamento online com Supabase;
- fallback local/offline;
- compatibilidade gradual com a lógica do Excel/SIIC.

## Estrutura proposta

```text
/
├── index.html
├── src/
│   ├── app.js
│   ├── data.js
│   ├── reports.js
│   ├── cash.js
│   ├── validation.js
│   └── styles.css
├── supabase/
│   ├── schema.sql
│   └── migrations/
└── docs/
```

## Camadas

### 1. Interface

Responsável apenas por mostrar e recolher dados.

### 2. Dados locais

Usa `localStorage` como fallback e cache.

### 3. Sincronização

Comunica com Supabase quando online.

### 4. Regras de negócio

Inclui:

- estados SIIC;
- validações;
- contagens;
- relatórios;
- subtotais;
- conflitos.

## Próxima migração segura

1. Criar `src/reports.js` com relatórios A4/PDF.
2. Criar `src/diagnostics.js`.
3. Criar `src/conflicts.js`.
4. Só depois substituir o `index.html` por uma versão modular.

## Nota sobre configuração Supabase

A chave pública/publishable pode ser usada em frontend, mas deve continuar protegida por RLS no Supabase. A chave `service_role` nunca deve ir para o código.
