# CNE Tesouraria v8/v9

Sistema progressivo de apoio à tesouraria e secretaria do CNE.

## Objetivos

- presenças;
- atividades;
- recebimentos/pagamentos;
- relatórios A4/PDF;
- contagem de numerário;
- auditoria;
- sincronização local e online;
- compatibilidade lógica com SIIC.

## Arquitetura

- GitHub Pages → aplicação
- Supabase → sincronização/base de dados
- Offline local → fallback seguro

## Estado atual

A base atual está em evolução gradual:

- v8.x → HTML único offline + sincronização gradual
- v9.x → sincronização Supabase completa

## Supabase

Usar apenas:

- URL pública do projeto
- publishable / anon key

Nunca colocar service_role no frontend.
