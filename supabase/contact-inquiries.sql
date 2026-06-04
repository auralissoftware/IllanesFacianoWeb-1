create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  service text not null default '',
  name text not null,
  phone text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists contact_inquiries_created_at_idx
  on public.contact_inquiries (created_at desc);

grant insert on public.contact_inquiries to anon, authenticated;
grant select on public.contact_inquiries to authenticated;

alter table public.contact_inquiries enable row level security;

drop policy if exists "Anyone can submit contact inquiries" on public.contact_inquiries;
create policy "Anyone can submit contact inquiries"
  on public.contact_inquiries
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins can read contact inquiries" on public.contact_inquiries;
create policy "Admins can read contact inquiries"
  on public.contact_inquiries
  for select
  to authenticated
  using (true);
