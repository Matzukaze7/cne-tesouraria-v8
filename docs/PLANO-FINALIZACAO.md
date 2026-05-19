# CNE Tesouraria v8 — Plano de Finalização Operacional

## Objetivo
Chegar a uma versão utilizável, estável e testável sem custos adicionais, usando GitHub + Supabase + PWA/browser.

## Prioridade 1 — Núcleo operacional leve
- [ ] Usar `teste-operacional.html` como base de validação rápida.
- [ ] Integrar todos os módulos críticos nesta página.
- [ ] Confirmar carregamento sem erros de consola.
- [ ] Confirmar leitura Supabase.
- [ ] Confirmar snapshots IndexedDB.
- [ ] Confirmar queue offline.

## Prioridade 2 — Relatórios
- [ ] Reduzir dependência de `relatorios.html` monolítico.
- [ ] Migrar tabelas para `relatorio-tabelas.js`.
- [ ] Migrar filtros para `relatorio-filtros.js`.
- [ ] Migrar totais/meta/badges para `relatorio-render.js`.
- [ ] Usar `report-utils.js` para cálculos e formatação.
- [ ] Separar CSS inline para `css/style.css`.
- [ ] Garantir relatórios A4/PDF.

## Prioridade 3 — Offline/realtime
- [ ] Queue com estados: pending, syncing, synced, error, conflict.
- [ ] Sync em batches.
- [ ] Anti-duplicados antes de sincronizar.
- [ ] Snapshots automáticos.
- [ ] Recovery após crash/browser fechado.
- [ ] Estado visual: Online, Offline, A sincronizar, Guardado localmente.

## Prioridade 4 — Robustez financeira
- [ ] Transferências internas fora dos totais reais.
- [ ] Subtotais SIIC normalizados.
- [ ] Separar origem operacional e destino financeiro.
- [ ] Pagamentos parciais visíveis.
- [ ] Fecho trimestral com snapshot congelado.
- [ ] Soft delete e restauro.

## Prioridade 5 — UX final
- [ ] Dashboard como lista de tarefas.
- [ ] Botões rápidos: Nova atividade, Receber pagamento, Contar caixa, Relatório.
- [ ] Mobile-first.
- [ ] Menos campos visíveis.
- [ ] Defaults inteligentes.
- [ ] Esconder complexidade SIIC em opções avançadas.

## Prioridade 6 — GitHub Pages / PWA
- [ ] Confirmar paths relativos.
- [ ] Confirmar manifest.
- [ ] Confirmar service worker.
- [ ] Confirmar cache versioning.
- [ ] Testar instalação no telemóvel.

## Quando pedir intervenção ao utilizador
Pedir feedback apenas quando:
- for necessário testar em telemóvel real;
- for necessário validar PDFs reais;
- houver risco de perda de dados;
- for necessário confirmar decisão UX importante;
- for necessário ativar GitHub Pages manualmente se a ferramenta não permitir.
