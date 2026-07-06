create table if not exists public.device_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null check (platform in ('android', 'ios', 'web')),
  token text not null,
  device_label text,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, token)
);

create index if not exists device_tokens_user_id_idx
on public.device_tokens(user_id);

create trigger device_tokens_set_updated_at
before update on public.device_tokens
for each row execute function public.set_updated_at();

alter table public.device_tokens enable row level security;

create policy "Users can read own device tokens"
on public.device_tokens for select
using (auth.uid() = user_id);

create policy "Users can create own device tokens"
on public.device_tokens for insert
with check (auth.uid() = user_id);

create policy "Users can update own device tokens"
on public.device_tokens for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own device tokens"
on public.device_tokens for delete
using (auth.uid() = user_id);

grant select, insert, update, delete
on public.device_tokens
to authenticated;
