-- Rode esse script inteiro no SQL Editor do Supabase (painel do projeto -> SQL Editor -> New query)
-- Cria a tabela de produtos, libera leitura pública e já insere os 5 produtos reais da Plavii.

create table if not exists products (
  id text primary key,
  slug text unique not null,
  name text not null,
  category text not null,
  price numeric(10,2) not null,
  old_price numeric(10,2),
  image text not null,
  description text not null,
  created_at timestamptz default now()
);

-- Row Level Security: por padrão ninguém acessa nada. Aqui liberamos só LEITURA pública
-- (qualquer pessoa pode ver os produtos, ninguém consegue editar/apagar sem estar autenticado).
alter table products enable row level security;

create policy "Produtos são públicos para leitura"
  on products for select
  using (true);

insert into products (id, slug, name, category, price, old_price, image, description) values
  ('power-bank-pineng', 'power-bank-20000mah-pineng', 'Power Bank 20000mAh — Pineng', 'Eletrônicos', 120.00, 160.00, '/produtos/power-bank-20000mah-pineng.jpg', 'Bateria portátil de 20.000mAh pra carregar o celular várias vezes sem precisar de tomada. Ideal pra quem sai cedo, viaja ou não pode ficar sem celular durante o dia. Compacta, resistente e compatível com iPhone, Android e outros dispositivos via USB.'),
  ('projetor-hy300', 'projetor-hy300-kapbom', 'Projetor HY300 — Kapbom', 'Eletrônicos', 289.00, 380.00, '/produtos/projetor-hy300-kapbom.jpg', 'Projetor portátil ideal para cinema em casa, apresentações e jogos. Imagem nítida, fácil de conectar ao celular ou notebook e leve o suficiente pra levar pra qualquer lugar.'),
  ('caixa-som-karaoke', 'caixa-som-karaoke', 'Caixa de Som Karaokê 2 Microfones', 'Áudio', 65.00, 85.00, '/produtos/caixa-som-karaoke.jpg', 'Caixa de som com dois microfones sem fio inclusos, perfeita pra animar qualquer reunião em casa. Bluetooth, bateria de longa duração e efeitos de luz.'),
  ('caixa-som-kimaster', 'caixa-som-kimaster-k400x', 'Caixa de Som K400x — Kimaster', 'Áudio', 90.00, 130.00, '/produtos/caixa-som-kimaster-k400x.jpg', 'Som potente com graves marcantes, conexão Bluetooth estável e bateria que dura o dia todo. Ótima pra festas, churrasco ou uso no dia a dia.'),
  ('massageador-muscular', 'massageador-muscular', 'Massageador Muscular Portátil', 'Utilidades domésticas', 50.00, 70.00, '/produtos/massageador-muscular.jpg', 'Massageador compacto e recarregável pra aliviar tensão muscular depois de um dia puxado. Vários níveis de intensidade e uso silencioso.')
on conflict (id) do nothing;
