-- Add is_paid to enrollments table
alter table public.enrollments add column if not exists is_paid boolean default false not null;

-- Create lesson_progress table
create table if not exists public.lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  course_name text not null,
  lesson_id integer not null,
  created_at timestamptz not null default now(),
  unique (user_id, course_name, lesson_id)
);

-- Enable RLS
alter table public.lesson_progress enable row level security;

-- Policies for RLS
create policy "Users can view own lesson progress"
  on public.lesson_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own lesson progress"
  on public.lesson_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own lesson progress"
  on public.lesson_progress for delete
  using (auth.uid() = user_id);
