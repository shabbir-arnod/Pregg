-- Pregg schema: run this once in the Supabase SQL editor (Project > SQL Editor > New query).
-- Every table is scoped to auth.uid() via Row Level Security, so the anon
-- client key can be used safely straight from the browser.

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  phone text,
  address text,
  created_at timestamptz not null default now()
);
alter table profiles enable row level security;
create policy "own profile" on profiles for all
  using (auth.uid() = id) with check (auth.uid() = id);

create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  type text not null check (type in ('medicine', 'exercise')),
  time text not null,
  days int[] not null default '{}',
  notes text,
  created_at timestamptz not null default now()
);
alter table reminders enable row level security;
create policy "own rows" on reminders for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists reminder_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  reminder_id uuid not null references reminders (id) on delete cascade,
  date date not null,
  completed_at timestamptz not null default now(),
  unique (reminder_id, date)
);
alter table reminder_logs enable row level security;
create policy "own rows" on reminder_logs for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists bp_readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  time text not null,
  systolic int not null,
  diastolic int not null,
  pulse int,
  notes text
);
alter table bp_readings enable row level security;
create policy "own rows" on bp_readings for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists weight_readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  weight numeric not null,
  notes text
);
alter table weight_readings enable row level security;
create policy "own rows" on weight_readings for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists symptom_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  symptoms text[] not null default '{}',
  notes text,
  unique (user_id, date)
);
alter table symptom_logs enable row level security;
create policy "own rows" on symptom_logs for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists kick_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  started_at timestamptz not null,
  duration_seconds int not null,
  kick_count int not null
);
alter table kick_sessions enable row level security;
create policy "own rows" on kick_sessions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  weight_unit text not null default 'kg' check (weight_unit in ('kg', 'lb')),
  due_date date,
  notifications_enabled boolean not null default false
);
alter table settings enable row level security;
create policy "own row" on settings for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
