# Teste funcional — CNE Tesouraria

## Estado testado

A versão publicada contém:

- Supabase ligado com autenticação anónima;
- pessoas;
- atividades;
- presenças;
- recebimentos;
- envio para validação;
- contagens de numerário;
- validação manual/com numerário;
- auditoria;
- relatório simples por atividade.

## Fluxo de teste recomendado

1. Abrir a app publicada.
2. Confirmar estado: `Ligado ao Supabase e sincronização ativa.`
3. Criar uma pessoa em `Pessoas`.
4. Criar uma atividade em `Atividades`.
5. Ir a `Atividade em curso`.
6. Marcar presença.
7. Registar recebimento.
8. Enviar rascunhos para validação.
9. Ir a `Contar dinheiro`.
10. Criar uma contagem igual ao valor recebido.
11. Ir a `Validar`.
12. Validar usando a contagem.
13. Confirmar que o saldo oficial muda.
14. Confirmar que a auditoria registou as ações.

## Problemas conhecidos / próximos ajustes

- O relatório ainda é simples e precisa de formato A4/PDF isolado.
- Falta relatório de trimestre com subtotais dinâmicos.
- Falta modo de impressão apenas do relatório escolhido.
- Falta resolução de conflitos multi-dispositivo.
- Falta perfil/secção/permissões.
- Falta UX mais próxima do protótipo avançado.

## Próxima versão proposta

### v9.1

- Relatórios A4/PDF limpos.
- Relatório de atividade completo.
- Relatório trimestral.
- Subtotais por tipo de movimento.
- Diagnóstico dentro da app.

### v9.2

- Perfis por função/secção.
- Permissões básicas.
- Modo adulto/validador.

### v9.3

- Conflitos multi-dispositivo.
- Offline queue.
- Sincronização diferida.
