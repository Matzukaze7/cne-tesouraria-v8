# GitHub Pages — Preparação CNE Tesouraria v8

## Objetivo
Permitir utilização real da aplicação:
- browser
- Android
- Samsung DeX
- PWA instalável
- offline-first
- sem backend visível

## Estrutura atual preparada
- Paths relativos (`./`)
- Manifest PWA
- Service worker
- Cache modular
- Offline snapshots
- Queue sync
- Realtime modular

## Página principal recomendada
Inicialmente:
- `teste-operacional.html`

Mais tarde:
- `dashboard.html`

## Ativar GitHub Pages
1. Abrir repositório.
2. Settings.
3. Pages.
4. Source:
   - Deploy from branch
5. Branch:
   - main
6. Folder:
   - /(root)

## URL esperada
https://matzukaze7.github.io/cne-tesouraria-v8/

## Checklist PWA
- [ ] Manifest válido
- [ ] Ícones PWA
- [ ] Service worker ativo
- [ ] Cache funcional
- [ ] Offline funcional
- [ ] Instalação Android
- [ ] Instalação Samsung DeX

## Testes recomendados
### Mobile
- Abrir relatórios grandes
- Offline 2h+
- Reabrir browser
- Fechar separador
- Instalar como app

### Multiutilizador
- 2+ dispositivos
- Alterações simultâneas
- Reconnect
- Queue recovery

## Problemas conhecidos atuais
- Relatórios ainda parcialmente pesados
- Queue ainda em evolução
- Realtime granular ainda parcial
- UX mobile ainda em refinamento

## Prioridade após GitHub Pages
1. Testes reais Android.
2. Stress-tests offline.
3. PDFs reais.
4. Refinamento UX.
5. Estabilização produção.
