-- Rode no SQL Editor do Supabase depois do 006_reviews.sql
-- Cria o "balde" público de fotos de avaliação. Qualquer pessoa vê as
-- fotos; um cliente logado só envia/troca/apaga fotos dentro da própria
-- pasta (nome do arquivo começa com o próprio user_id).

insert into storage.buckets (id, name, public)
values ('avaliacoes', 'avaliacoes', true)
on conflict (id) do nothing;

create policy "Cliente logado envia foto na própria pasta"
  on storage.objects for insert
  with check (
    bucket_id = 'avaliacoes'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Cliente troca a própria foto de avaliação"
  on storage.objects for update
  using (
    bucket_id = 'avaliacoes'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Cliente apaga a própria foto de avaliação"
  on storage.objects for delete
  using (
    bucket_id = 'avaliacoes'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
