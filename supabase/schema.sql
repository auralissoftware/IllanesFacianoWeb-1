create extension if not exists "pgcrypto";

create table if not exists public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  categoria text not null check (categoria in ('propiedades', 'bienes_muebles', 'remates')),
  titulo text not null,
  descripcion text not null,
  ubicacion text not null,
  precio text not null,
  estado text,
  details jsonb not null default '{}'::jsonb,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.catalog_media (
  id uuid primary key default gen_random_uuid(),
  catalog_item_id uuid not null references public.catalog_items(id) on delete cascade,
  storage_path text not null,
  public_url text not null,
  kind text not null check (kind in ('image', 'video')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists catalog_items_categoria_idx on public.catalog_items (categoria);
create index if not exists catalog_items_published_idx on public.catalog_items (published);
create index if not exists catalog_media_item_idx on public.catalog_media (catalog_item_id);

grant usage on schema public to anon, authenticated;

grant select on public.catalog_items to anon, authenticated;
grant insert, update, delete on public.catalog_items to authenticated;

grant select on public.catalog_media to anon, authenticated;
grant insert, delete on public.catalog_media to authenticated;

alter table public.catalog_items enable row level security;
alter table public.catalog_media enable row level security;

drop policy if exists "Public can read published catalog items" on public.catalog_items;
create policy "Public can read published catalog items"
  on public.catalog_items
  for select
  using (published = true);

drop policy if exists "Admins can insert catalog items" on public.catalog_items;
create policy "Admins can insert catalog items"
  on public.catalog_items
  for insert
  to authenticated
  with check (true);

drop policy if exists "Admins can update catalog items" on public.catalog_items;
create policy "Admins can update catalog items"
  on public.catalog_items
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admins can delete catalog items" on public.catalog_items;
create policy "Admins can delete catalog items"
  on public.catalog_items
  for delete
  to authenticated
  using (true);

drop policy if exists "Public can read catalog media" on public.catalog_media;
create policy "Public can read catalog media"
  on public.catalog_media
  for select
  using (
    exists (
      select 1
      from public.catalog_items ci
      where ci.id = catalog_media.catalog_item_id
        and ci.published = true
    )
  );

drop policy if exists "Admins can insert catalog media" on public.catalog_media;
create policy "Admins can insert catalog media"
  on public.catalog_media
  for insert
  to authenticated
  with check (true);

drop policy if exists "Admins can delete catalog media" on public.catalog_media;
create policy "Admins can delete catalog media"
  on public.catalog_media
  for delete
  to authenticated
  using (true);

insert into storage.buckets (id, name, public)
values ('catalog-media', 'catalog-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read catalog media files" on storage.objects;
create policy "Public read catalog media files"
  on storage.objects
  for select
  using (bucket_id = 'catalog-media');

drop policy if exists "Admins upload catalog media files" on storage.objects;
create policy "Admins upload catalog media files"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'catalog-media');

drop policy if exists "Admins delete catalog media files" on storage.objects;
create policy "Admins delete catalog media files"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'catalog-media');
