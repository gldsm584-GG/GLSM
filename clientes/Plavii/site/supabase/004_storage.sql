-- Rode no SQL Editor do Supabase depois do 003_admin.sql
-- Cria o "balde" público de fotos de produto. Qualquer pessoa vê as fotos;
-- só o(s) email(s) de admin conseguem enviar, trocar ou apagar.

insert into storage.buckets (id, name, public)
values ('produtos', 'produtos', true)
on conflict (id) do nothing;

create policy "Admin envia fotos de produto"
  on storage.objects for insert
  with check (
    bucket_id = 'produtos'
    and auth.jwt() ->> 'email' in ('gustavo.teste.plavii@gmail.com')
  );

create policy "Admin troca fotos de produto"
  on storage.objects for update
  using (
    bucket_id = 'produtos'
    and auth.jwt() ->> 'email' in ('gustavo.teste.plavii@gmail.com')
  );

create policy "Admin apaga fotos de produto"
  on storage.objects for delete
  using (
    bucket_id = 'produtos'
    and auth.jwt() ->> 'email' in ('gustavo.teste.plavii@gmail.com')
  );
