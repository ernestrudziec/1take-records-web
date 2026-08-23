-- Migration 002: booking history, monthly billing, payment audit
-- Run after schema.sql in Supabase SQL Editor

create table if not exists public.booking_events (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings (id) on delete set null,
  user_id uuid not null references public.profiles (id) on delete cascade,
  actor_id uuid not null references public.profiles (id) on delete cascade,
  event_type text not null check (event_type in ('created', 'updated', 'cancelled')),
  start_at timestamptz not null,
  end_at timestamptz not null,
  notes text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.billing_months (
  id uuid primary key default gen_random_uuid(),
  year int not null check (year >= 2020),
  month int not null check (month between 1 and 12),
  total_amount numeric(12, 2) not null default 0,
  invoice_path text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (year, month)
);

create table if not exists public.user_monthly_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  year int not null check (year >= 2020),
  month int not null check (month between 1 and 12),
  amount_due numeric(12, 2) not null default 0,
  user_marked_paid boolean not null default false,
  admin_marked_paid boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, year, month)
);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.user_monthly_payments (id) on delete cascade,
  actor_id uuid not null references public.profiles (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'amount_set',
      'user_marked_paid',
      'user_unmarked_paid',
      'admin_marked_paid',
      'admin_unmarked_paid',
      'invoice_uploaded',
      'month_total_set'
    )
  ),
  old_value jsonb,
  new_value jsonb,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists booking_events_user_id_idx on public.booking_events (user_id, created_at desc);
create index if not exists booking_events_booking_id_idx on public.booking_events (booking_id);
create index if not exists user_monthly_payments_period_idx on public.user_monthly_payments (year, month);
create index if not exists payment_events_payment_id_idx on public.payment_events (payment_id, created_at desc);

alter table public.booking_events enable row level security;
alter table public.billing_months enable row level security;
alter table public.user_monthly_payments enable row level security;
alter table public.payment_events enable row level security;

create policy "booking_events_select_own_or_admin"
  on public.booking_events for select to authenticated
  using (
    user_id = auth.uid()
    or actor_id = auth.uid()
    or exists (select 1 from public.profiles where id = auth.uid() and is_admin)
  );

create policy "booking_events_insert_authenticated"
  on public.booking_events for insert to authenticated
  with check (actor_id = auth.uid());

create policy "billing_months_select_authenticated"
  on public.billing_months for select to authenticated
  using (true);

create policy "billing_months_admin_write"
  on public.billing_months for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin));

create policy "user_payments_select_own_or_admin"
  on public.user_monthly_payments for select to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from public.profiles where id = auth.uid() and is_admin)
  );

create policy "user_payments_update_own_mark"
  on public.user_monthly_payments for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "user_payments_admin_write"
  on public.user_monthly_payments for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin));

create policy "payment_events_select"
  on public.payment_events for select to authenticated
  using (
    exists (
      select 1 from public.user_monthly_payments p
      where p.id = payment_id
        and (p.user_id = auth.uid() or exists (
          select 1 from public.profiles where id = auth.uid() and is_admin
        ))
    )
  );

create policy "payment_events_insert"
  on public.payment_events for insert to authenticated
  with check (actor_id = auth.uid());

-- Storage bucket for invoice screenshots (create in Dashboard → Storage if SQL fails)
insert into storage.buckets (id, name, public)
values ('invoices', 'invoices', true)
on conflict (id) do nothing;

create policy "invoices_read_authenticated"
  on storage.objects for select to authenticated
  using (bucket_id = 'invoices');

create policy "invoices_admin_upload"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'invoices'
    and exists (select 1 from public.profiles where id = auth.uid() and is_admin)
  );

create policy "invoices_admin_update"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'invoices'
    and exists (select 1 from public.profiles where id = auth.uid() and is_admin)
  );

create policy "invoices_admin_delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'invoices'
    and exists (select 1 from public.profiles where id = auth.uid() and is_admin)
  );
