alter table public.schedules
add column if not exists start_date date not null default current_date;

create index if not exists schedules_start_date_idx
on public.schedules(user_id, start_date);
