-- Create enrollments table
create table public.enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  course_name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, course_name)
);

-- Enable RLS
alter table public.enrollments enable row level security;

-- Policies for RLS
create policy "Users can view own enrollments"
  on public.enrollments for select
  using (auth.uid() = user_id);

create policy "Users can insert own enrollments"
  on public.enrollments for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own enrollments"
  on public.enrollments for delete
  using (auth.uid() = user_id);
