create extension if not exists pgcrypto;

create table if not exists app_devices (
  id uuid primary key default gen_random_uuid(),
  device_name text,
  created_at timestamptz default now()
);

create table if not exists pessoas (
  id text primary key,
  nome text not null,
  secao text not null,
  subgrupo text,
  ativo boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists atividades (
  id text primary key,
  nome text not null,
  secao text not null,
  tipo text not null,
  ambito text default 'secao',
  secao_origem text,
  conta_financeira text default 'secao',
  validador_nivel text default 'secao',
  data_inicio date,
  data_fim date,
  local text,
  valor_padrao numeric default 0,
  estado text default 'aberta',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table atividades add column if not exists ambito text default 'secao';
alter table atividades add column if not exists secao_origem text;
alter table atividades add column if not exists conta_financeira text default 'secao';
alter table atividades add column if not exists validador_nivel text default 'secao';

create table if not exists presencas (
  id text primary key,
  pessoa_id text not null,
  atividade_id text not null,
  estado text not null default 'pendente',
  estado_validacao text default 'rascunho',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (pessoa_id, atividade_id)
);

create table if not exists movimentos (
  id text primary key,
  pessoa_id text,
  atividade_id text,
  tipo text not null,
  tipo_movimento text,
  origem text,
  valor numeric default 0,
  estado_validacao text default 'rascunho',
  estado_siic text,
  descricao text,
  metodo_validacao text,
  contagem_id text,
  ambito text default 'secao',
  secao_origem text,
  conta_financeira text default 'secao',
  validador_nivel text default 'secao',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table movimentos add column if not exists metodo_validacao text;
alter table movimentos add column if not exists contagem_id text;
alter table movimentos add column if not exists ambito text default 'secao';
alter table movimentos add column if not exists secao_origem text;
alter table movimentos add column if not exists conta_financeira text default 'secao';
alter table movimentos add column if not exists validador_nivel text default 'secao';

create table if not exists contagens (
  id text primary key,
  secao text not null,
  atividade_id text,
  notas jsonb default '{}'::jsonb,
  moedas jsonb default '{}'::jsonb,
  total_contado numeric default 0,
  total_associado numeric default 0,
  restante numeric default 0,
  estado text default 'aberta',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists validacoes (
  id text primary key,
  movimento_id text not null,
  metodo_validacao text not null default 'manual',
  contagem_id text,
  checklist jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists auditoria (
  id text primary key,
  tipo text not null,
  entidade text,
  detalhe text,
  created_at timestamptz default now()
);

alter table pessoas enable row level security;
alter table atividades enable row level security;
alter table presencas enable row level security;
alter table movimentos enable row level security;
alter table contagens enable row level security;
alter table validacoes enable row level security;
alter table auditoria enable row level security;

do $$ begin create policy "anon_read_pessoas" on pessoas for select using (auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "anon_insert_pessoas" on pessoas for insert with check (auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "anon_update_pessoas" on pessoas for update using (auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "anon_read_atividades" on atividades for select using (auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "anon_insert_atividades" on atividades for insert with check (auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "anon_update_atividades" on atividades for update using (auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "anon_read_presencas" on presencas for select using (auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "anon_insert_presencas" on presencas for insert with check (auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "anon_update_presencas" on presencas for update using (auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "anon_read_movimentos" on movimentos for select using (auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "anon_insert_movimentos" on movimentos for insert with check (auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "anon_update_movimentos" on movimentos for update using (auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "anon_read_contagens" on contagens for select using (auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "anon_insert_contagens" on contagens for insert with check (auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "anon_update_contagens" on contagens for update using (auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "anon_read_validacoes" on validacoes for select using (auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "anon_insert_validacoes" on validacoes for insert with check (auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "anon_read_auditoria" on auditoria for select using (auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "anon_insert_auditoria" on auditoria for insert with check (auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
