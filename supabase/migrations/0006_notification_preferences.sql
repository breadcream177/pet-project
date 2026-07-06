create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enabled boolean not null default false,
  minutes_before integer not null default 10 check (minutes_before in (0, 5, 10, 30, 60)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger notification_preferences_set_updated_at
before update on public.notification_preferences
for each row execute function public.set_updated_at();

alter table public.notification_preferences enable row level security;

create policy "Users can read own notification preferences"
on public.notification_preferences for select
using (auth.uid() = user_id);

create policy "Users can create own notification preferences"
on public.notification_preferences for insert
with check (auth.uid() = user_id);

create policy "Users can update own notification preferences"
on public.notification_preferences for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

grant select, insert, update
on public.notification_preferences
to authenticated;
