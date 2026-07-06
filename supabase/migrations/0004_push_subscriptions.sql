create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null,
  p256dh_key text not null,
  auth_key text not null,
  expiration_time timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, endpoint)
);

create index if not exists push_subscriptions_user_id_idx
on public.push_subscriptions(user_id);

create trigger push_subscriptions_set_updated_at
before update on public.push_subscriptions
for each row execute function public.set_updated_at();

alter table public.push_subscriptions enable row level security;

create policy "Users can read own push subscriptions"
on public.push_subscriptions for select
using (auth.uid() = user_id);

create policy "Users can create own push subscriptions"
on public.push_subscriptions for insert
with check (auth.uid() = user_id);

create policy "Users can update own push subscriptions"
on public.push_subscriptions for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own push subscriptions"
on public.push_subscriptions for delete
using (auth.uid() = user_id);

grant select, insert, update, delete
on public.push_subscriptions
to authenticated;
