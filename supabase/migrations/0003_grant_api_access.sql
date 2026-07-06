grant usage on schema public to authenticated;

grant select, insert, update, delete
on public.profiles,
   public.pets,
   public.schedules,
   public.schedule_completions
to authenticated;

grant usage, select
on all sequences in schema public
to authenticated;
