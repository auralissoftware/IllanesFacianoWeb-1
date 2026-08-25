-- Estadísticas de visualizaciones del catálogo
-- Ejecutar en el SQL Editor de Supabase después de schema.sql

create table if not exists public.catalog_views (
  id uuid primary key default gen_random_uuid(),
  catalog_item_id uuid not null references public.catalog_items(id) on delete cascade,
  province text,
  country text,
  viewed_at timestamptz not null default now()
);

create index if not exists catalog_views_item_idx on public.catalog_views (catalog_item_id);
create index if not exists catalog_views_province_idx on public.catalog_views (province);
create index if not exists catalog_views_viewed_at_idx on public.catalog_views (viewed_at desc);

grant select on public.catalog_views to authenticated;
grant insert on public.catalog_views to anon, authenticated;

alter table public.catalog_views enable row level security;

drop policy if exists "Anyone can record views on published items" on public.catalog_views;
create policy "Anyone can record views on published items"
  on public.catalog_views
  for insert
  to anon, authenticated
  with check (
    exists (
      select 1
      from public.catalog_items ci
      where ci.id = catalog_item_id
        and ci.published = true
    )
  );

drop policy if exists "Admins can read catalog views" on public.catalog_views;
create policy "Admins can read catalog views"
  on public.catalog_views
  for select
  to authenticated
  using (true);

-- Top N publicaciones más visitadas
create or replace function public.get_top_catalog_publications(p_limit int default 5)
returns table (
  catalog_item_id uuid,
  titulo text,
  slug text,
  categoria text,
  view_count bigint
)
language sql
security definer
set search_path = public
as $$
  select
    ci.id,
    ci.titulo,
    ci.slug,
    ci.categoria,
    count(cv.id) as view_count
  from public.catalog_items ci
  inner join public.catalog_views cv on cv.catalog_item_id = ci.id
  group by ci.id, ci.titulo, ci.slug, ci.categoria
  order by view_count desc, ci.titulo asc
  limit greatest(p_limit, 1);
$$;

-- Visitas agrupadas por provincia (visitantes desde Argentina)
create or replace function public.get_catalog_views_by_province()
returns table (
  province text,
  view_count bigint
)
language sql
security definer
set search_path = public
as $$
  select
    coalesce(nullif(trim(province), ''), 'Sin provincia') as province,
    count(*)::bigint as view_count
  from public.catalog_views
  where country in ('AR', 'Argentina')
  group by 1
  order by view_count desc, province asc;
$$;

-- Conteo de visitas por publicación (para el listado admin)
create or replace function public.get_catalog_view_counts()
returns table (
  catalog_item_id uuid,
  view_count bigint
)
language sql
security definer
set search_path = public
as $$
  select
    catalog_item_id,
    count(*)::bigint as view_count
  from public.catalog_views
  group by catalog_item_id;
$$;

-- Provincias de visitantes para una publicación concreta
create or replace function public.get_catalog_item_view_provinces(p_item_id uuid)
returns table (
  province text,
  view_count bigint
)
language sql
security definer
set search_path = public
as $$
  select
    coalesce(nullif(trim(province), ''), 'Sin provincia') as province,
    count(*)::bigint as view_count
  from public.catalog_views
  where catalog_item_id = p_item_id
    and country in ('AR', 'Argentina')
  group by 1
  order by view_count desc, province asc;
$$;

-- Total de visitas del sitio (todas las publicaciones)
create or replace function public.get_catalog_total_views()
returns bigint
language sql
security definer
set search_path = public
as $$
  select count(*)::bigint from public.catalog_views;
$$;

-- Provincias de visitantes para todas las publicaciones
create or replace function public.get_all_catalog_item_view_provinces()
returns table (
  catalog_item_id uuid,
  province text,
  view_count bigint
)
language sql
security definer
set search_path = public
as $$
  select
    catalog_item_id,
    coalesce(nullif(trim(province), ''), 'Sin provincia') as province,
    count(*)::bigint as view_count
  from public.catalog_views
  where country in ('AR', 'Argentina')
  group by catalog_item_id, 2
  order by catalog_item_id, view_count desc, province asc;
$$;

revoke all on function public.get_catalog_total_views() from public;
revoke all on function public.get_all_catalog_item_view_provinces() from public;

grant execute on function public.get_catalog_total_views() to authenticated;
grant execute on function public.get_all_catalog_item_view_provinces() to authenticated;

revoke all on function public.get_top_catalog_publications(int) from public;
revoke all on function public.get_catalog_views_by_province() from public;
revoke all on function public.get_catalog_view_counts() from public;
revoke all on function public.get_catalog_item_view_provinces(uuid) from public;

grant execute on function public.get_top_catalog_publications(int) to authenticated;
grant execute on function public.get_catalog_views_by_province() to authenticated;
grant execute on function public.get_catalog_view_counts() to authenticated;
grant execute on function public.get_catalog_item_view_provinces(uuid) to authenticated;
