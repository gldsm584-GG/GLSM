-- ============================================================
-- Geocar Automóveis — schema completo (projeto Supabase novo)
-- Rode esse arquivo inteiro no SQL Editor do Supabase e depois o seed.sql.
--
-- ANTES DE RODAR: crie a conta do admin em Authentication → Users → Add user
-- → Create new user (marcar "Auto Confirm User"). Se o email virar admin
-- antes de a conta existir, alguém poderia se cadastrar com ele.
--
-- O email do admin fica num lugar só: a função is_admin() abaixo (e em
-- src/lib/admin.ts). Pra trocar, muda a lista nos dois e roda de novo o
-- "create or replace function".
-- ============================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) in ('gldsm584@gmail.com');
$$;

-- VEÍCULOS ----------------------------------------------------------------
create table if not exists veiculos (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  tipo text not null default 'carro' check (tipo in ('carro', 'moto')),
  marca text not null,
  modelo text not null,
  versao text,
  ano_fabricacao int,
  ano_modelo int not null,
  km int,
  cambio text,
  combustivel text,
  cor text,
  motor text,
  preco numeric(12,2),
  status text not null default 'disponivel'
    check (status in ('disponivel', 'reservado', 'vendido')),
  destaque boolean not null default false,
  opcionais text[] not null default '{}',
  descricao text,
  fotos text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table veiculos enable row level security;

drop policy if exists "Veículos são públicos para leitura" on veiculos;
create policy "Veículos são públicos para leitura"
  on veiculos for select using (true);

drop policy if exists "Admin gerencia veículos" on veiculos;
create policy "Admin gerencia veículos"
  on veiculos for all
  using (public.is_admin())
  with check (public.is_admin());

-- NEGOCIAÇÕES (CRM — funil de vendas, só o admin vê) ----------------------
create table if not exists negociacoes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text,
  veiculo_id uuid references veiculos(id) on delete set null,
  origem text,
  etapa text not null default 'novo'
    check (etapa in ('novo', 'negociando', 'visita', 'vendido', 'perdido')),
  observacao text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table negociacoes enable row level security;

drop policy if exists "Admin gerencia negociações" on negociacoes;
create policy "Admin gerencia negociações"
  on negociacoes for all
  using (public.is_admin())
  with check (public.is_admin());

-- STORAGE (fotos enviadas pelo painel) ------------------------------------
insert into storage.buckets (id, name, public)
values ('veiculos', 'veiculos', true)
on conflict (id) do nothing;

drop policy if exists "Admin envia fotos de veículo" on storage.objects;
create policy "Admin envia fotos de veículo" on storage.objects for insert
  with check (bucket_id = 'veiculos' and public.is_admin());

drop policy if exists "Admin troca fotos de veículo" on storage.objects;
create policy "Admin troca fotos de veículo" on storage.objects for update
  using (bucket_id = 'veiculos' and public.is_admin());

drop policy if exists "Admin apaga fotos de veículo" on storage.objects;
create policy "Admin apaga fotos de veículo" on storage.objects for delete
  using (bucket_id = 'veiculos' and public.is_admin());

drop policy if exists "Fotos de veículo são públicas para leitura" on storage.objects;
create policy "Fotos de veículo são públicas para leitura" on storage.objects for select
  using (bucket_id = 'veiculos');
