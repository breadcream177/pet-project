create extension if not exists pgcrypto;

create type public.schedule_category as enum (
  'meal',
  'walk',
  'medicine',
  'hospital',
  'care'
);

create type public.repeat_rule as enum (
  'none',
  'daily',
  'weekly'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) <= 50),
  species text not null check (char_length(species) <= 50),
  color text not null check (color ~ '^#[0-9A-Fa-f]{6}$'),
  memo text check (memo is null or char_length(memo) <= 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pet_id uuid not null references public.pets(id) on delete cascade,
  title text not null check (char_length(title) <= 80),
  category public.schedule_category not null,
  time time not null,
  repeat_rule public.repeat_rule not null default 'none',
  day_of_week int check (day_of_week is null or day_of_week between 0 and 6),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.schedule_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  schedule_id uuid not null references public.schedules(id) on delete cascade,
  completed_date date not null,
  completed_at timestamptz not null default now(),
  unique (schedule_id, completed_date)
);

create index pets_user_id_idx on public.pets(user_id);
create index schedules_user_id_idx on public.schedules(user_id);
create index schedules_pet_id_idx on public.schedules(pet_id);
create index schedules_active_idx on public.schedules(user_id, is_active);
create index schedule_completions_user_date_idx
  on public.schedule_completions(user_id, completed_date);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger pets_set_updated_at
before update on public.pets
for each row execute function public.set_updated_at();

create trigger schedules_set_updated_at
before update on public.schedules
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.pets enable row level security;
alter table public.schedules enable row level security;
alter table public.schedule_completions enable row level security;

create policy "Users can read own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can read own pets"
on public.pets for select
using (auth.uid() = user_id);

create policy "Users can create own pets"
on public.pets for insert
with check (auth.uid() = user_id);

create policy "Users can update own pets"
on public.pets for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own pets"
on public.pets for delete
using (auth.uid() = user_id);

create policy "Users can read own schedules"
on public.schedules for select
using (auth.uid() = user_id);

create policy "Users can create own schedules"
on public.schedules for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.pets
    where pets.id = pet_id
      and pets.user_id = auth.uid()
  )
);

create policy "Users can update own schedules"
on public.schedules for update
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.pets
    where pets.id = pet_id
      and pets.user_id = auth.uid()
  )
);

create policy "Users can delete own schedules"
on public.schedules for delete
using (auth.uid() = user_id);

create policy "Users can read own completions"
on public.schedule_completions for select
using (auth.uid() = user_id);

create policy "Users can create own completions"
on public.schedule_completions for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.schedules
    where schedules.id = schedule_id
      and schedules.user_id = auth.uid()
  )
);

create policy "Users can delete own completions"
on public.schedule_completions for delete
using (auth.uid() = user_id);
