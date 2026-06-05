-- Combined SQL script to set up the database tables, triggers, and row level security for EduWave in Supabase.
-- You can copy this script and paste it directly into the SQL Editor in your Supabase Dashboard:
-- https://supabase.com/dashboard/project/qtajuxzsuwtvlrxdyfrq/sql/new

-- ---------------------------------------------------------
-- 1. Create profiles table
-- ---------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now(),
  avatar_url text
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Policies for profiles
drop policy if exists "Profiles are viewable by owner" on public.profiles;
create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Trigger to create a profile automatically when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Revoke public execution on this function for security
revoke execute on function public.handle_new_user() from anon, authenticated, public;


-- ---------------------------------------------------------
-- 2. Create enrollments table
-- ---------------------------------------------------------
create table if not exists public.enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  course_name text not null,
  created_at timestamptz not null default now(),
  is_paid boolean default false not null,
  unique (user_id, course_name)
);

-- Enable RLS for enrollments
alter table public.enrollments enable row level security;

-- Policies for enrollments
drop policy if exists "Users can view own enrollments" on public.enrollments;
create policy "Users can view own enrollments"
  on public.enrollments for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own enrollments" on public.enrollments;
create policy "Users can insert own enrollments"
  on public.enrollments for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own enrollments" on public.enrollments;
create policy "Users can delete own enrollments"
  on public.enrollments for delete
  using (auth.uid() = user_id);


-- ---------------------------------------------------------
-- 3. Create lesson_progress table
-- ---------------------------------------------------------
create table if not exists public.lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  course_name text not null,
  lesson_id integer not null,
  created_at timestamptz not null default now(),
  unique (user_id, course_name, lesson_id)
);

-- Enable RLS for lesson_progress
alter table public.lesson_progress enable row level security;

-- Policies for lesson_progress
drop policy if exists "Users can view own lesson progress" on public.lesson_progress;
create policy "Users can view own lesson progress"
  on public.lesson_progress for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own lesson progress" on public.lesson_progress;
create policy "Users can insert own lesson progress"
  on public.lesson_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own lesson progress" on public.lesson_progress;
create policy "Users can delete own lesson progress"
  on public.lesson_progress for delete
  using (auth.uid() = user_id);


-- ---------------------------------------------------------
-- 4. Trigger to automatically confirm email for new signups
-- ---------------------------------------------------------
create or replace function public.handle_auto_confirm_user()
returns trigger as $$
begin
  new.email_confirmed_at = now();
  new.confirmed_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger to ensure it runs before insert
drop trigger if exists auto_confirm_user_trigger on auth.users;
create trigger auto_confirm_user_trigger
  before insert on auth.users
  for each row
  execute function public.handle_auto_confirm_user();


-- ---------------------------------------------------------
-- 5. Create plans and subscriptions tables
-- ---------------------------------------------------------
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

