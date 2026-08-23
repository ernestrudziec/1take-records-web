-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text not null,
  color text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  start_at timestamptz not null,
  end_at timestamptz not null,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_range check (end_at > start_at)
);

create index if not exists bookings_start_at_idx on public.bookings (start_at);
create index if not exists bookings_user_id_idx on public.bookings (user_id);

alter table public.profiles enable row level security;
alter table public.bookings enable row level security;

create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "bookings_select_authenticated"
  on public.bookings for select
  to authenticated
  using (true);

create policy "bookings_insert_own"
  on public.bookings for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "bookings_update_own_or_admin"
  on public.bookings for update
  to authenticated
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  palette text[] := array[
    '#F87171', '#FB923C', '#FBBF24', '#A3E635', '#34D399',
    '#22D3EE', '#60A5FA', '#A78BFA', '#F472B6', '#E879F9'
  ];
  next_color text;
begin
  next_color := palette[(select count(*) from public.profiles) % array_length(palette, 1) + 1];

  insert into public.profiles (id, email, display_name, color, is_admin)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    next_color,
    lower(new.email) = lower('admin@1take.records')
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- If admin account existed before running this, run once:
-- update public.profiles set is_admin = true where lower(email) = lower('admin@1take.records');
