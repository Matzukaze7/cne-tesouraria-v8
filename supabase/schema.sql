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
  data_inicio date,
  data_fim date,
  local text,
  valor_padrao numeric default 0,
  estado text default 'aberta',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

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
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table pessoas enable row level security;
alter table atividades enable row level security;
alter table presencas enable row level security;
alter table movimentos enable row level security;

do $$
begin
  create policy "anon_read_pessoas" on pessoas for select using (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "anon_insert_pessoas" on pessoas for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "anon_update_pessoas" on pessoas for update using (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "anon_read_atividades" on atividades for select using (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "anon_insert_atividades" on atividades for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "anon_update_atividades" on atividades for update using (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "anon_read_presencas" on presencas for select using (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "anon_insert_presencas" on presencas for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "anon_update_presencas" on presencas for update using (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "anon_read_movimentos" on movimentos for select using (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "anon_insert_movimentos" on movimentos for insert with check (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "anon_update_movimentos" on movimentos for update using (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;
