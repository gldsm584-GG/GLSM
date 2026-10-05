-- Rode no SQL Editor do Supabase.
-- Guarda no pedido como o cliente quer receber: retirada na loja (grátis)
-- ou frete do Melhor Envio (serviço, valor e prazo em dias úteis).
-- Sem esta migração o checkout continua funcionando (o frete entra no total
-- e no Mercado Pago), só não fica registrado o método no pedido.

alter table orders add column if not exists delivery_method text;   -- 'pickup' | 'shipping'
alter table orders add column if not exists shipping_service text;  -- ex.: 'Correios SEDEX'
alter table orders add column if not exists shipping_cost numeric(10,2) not null default 0;
alter table orders add column if not exists shipping_days integer;
