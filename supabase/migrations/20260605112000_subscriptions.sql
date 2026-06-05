-- Create plans table
create table if not exists public.plans (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  price_text text not null,
  price_numeric integer not null,
  description text not null,
  features text[] not null,
  cta text not null default 'Выбрать план',
  highlight boolean default false not null,
  created_at timestamptz not null default now()
);

-- Enable RLS for plans
alter table public.plans enable row level security;

-- Policies for plans
drop policy if exists "Allow public read access to plans" on public.plans;
create policy "Allow public read access to plans"
  on public.plans for select
  using (true);

-- Insert initial plans
insert into public.plans (name, price_text, price_numeric, description, features, cta, highlight) values
('Старт', 'Бесплатно', 0, 'Попробуй формат', array['🔓 Доступ к вводным урокам', '🤖 Базовый ИИ-помощник', '💬 Поддержка в чате', '📊 Прогресс-трекер обучения'], 'Начать', false),
('Стандарт', '14 990 ₸/мес', 14990, 'Самый популярный', array['📚 1 профессиональный курс', '✍️ Домашки с проверкой эксперта', '⚡ Умный ИИ-репетитор 24/7 (Разбор ошибок)', '🎙️ Участие в живых эфирах', '🎓 Официальный сертификат'], 'Выбрать план', true),
('Премиум', '29 990 ₸/мес', 29990, 'Максимум возможностей', array['🚀 Полный доступ ко всем курсам', '🤖 Персональный ИИ-ментор (GPT-4o)', '🧑‍🏫 Личный наставник & созвоны', '🎯 Индивидуальный трек подготовки ОГЭ/ЕГЭ', '💼 Карьерный буст: резюме & стажировки'], 'Выбрать план', false)
on conflict (name) do update set
  price_text = excluded.price_text,
  price_numeric = excluded.price_numeric,
  description = excluded.description,
  features = excluded.features,
  cta = excluded.cta,
  highlight = excluded.highlight;

-- Create subscriptions table
create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_name text not null references public.plans(name) on delete cascade,
  status text not null default 'active',
  payment_method text not null,
  amount_paid integer not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '1 month',
  unique (user_id, plan_name)
);

-- Enable RLS for subscriptions
alter table public.subscriptions enable row level security;

-- Policies for subscriptions
drop policy if exists "Users can view own subscriptions" on public.subscriptions;
create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own subscriptions" on public.subscriptions;
create policy "Users can insert own subscriptions"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own subscriptions" on public.subscriptions;
create policy "Users can update own subscriptions"
  on public.subscriptions for update
  using (auth.uid() = user_id);
