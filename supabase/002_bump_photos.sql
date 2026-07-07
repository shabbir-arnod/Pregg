-- Adds weekly bump-photo support. Run this once in the Supabase SQL editor
-- (Project > SQL Editor > New query) — schema.sql should already have been
-- run before this; this file only adds new objects, it does not touch
-- anything created by schema.sql.

create table if not exists bump_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  storage_path text not null,
  notes text,
  created_at timestamptz not null default now()
);
alter table bump_photos enable row level security;
create policy "own rows" on bump_photos for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Private bucket: files are only reachable through the authenticated
-- client, scoped per-user by the policies below (not a public URL).
insert into storage.buckets (id, name, public)
values ('bump-photos', 'bump-photos', false)
on conflict (id) do nothing;

-- Photos are stored at "<user_id>/<filename>"; these policies restrict
-- each user to their own folder.
create policy "own bump photos read" on storage.objects for select
  using (bucket_id = 'bump-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own bump photos insert" on storage.objects for insert
  with check (bucket_id = 'bump-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own bump photos delete" on storage.objects for delete
  using (bucket_id = 'bump-photos' and (storage.foldername(name))[1] = auth.uid()::text);
