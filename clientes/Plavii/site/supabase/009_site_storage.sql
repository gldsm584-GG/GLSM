-- Rode no SQL Editor do Supabase depois do 008_site_content.sql
-- Cria o "balde" público de imagens do site (Hero da home + páginas em
-- branco). Qualquer pessoa vê; só o admin envia/troca/apaga.

insert into storage.buckets (id, name, public)
values ('site', 'site', true)
on conflict (id) do nothing;

create policy "Admin envia imagem do site"
  on storage.objects for insert
  with check (
    bucket_id = 'site'
    and auth.jwt() ->> 'email' in ('gustest@gmail.com')
  );

create policy "Admin troca imagem do site"
  on storage.objects for update
  using (
    bucket_id = 'site'
    and auth.jwt() ->> 'email' in ('gustest@gmail.com')
  );

create policy "Admin apaga imagem do site"
  on storage.objects for delete
  using (
    bucket_id = 'site'
    and auth.jwt() ->> 'email' in ('gustest@gmail.com')
  );
