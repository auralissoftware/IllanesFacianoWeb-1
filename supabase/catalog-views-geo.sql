-- Ampliación geográfica internacional de catalog_views
-- Ejecutar en Supabase SQL Editor (después de catalog-views.sql)

alter table public.catalog_views add column if not exists country_code text;
alter table public.catalog_views add column if not exists country_name text;
alter table public.catalog_views add column if not exists region text;
alter table public.catalog_views add column if not exists city text;

update public.catalog_views
set region = province
where region is null and province is not null;

update public.catalog_views
set country_code = upper(trim(country))
where country_code is null
  and country is not null
  and length(trim(country)) = 2;

update public.catalog_views
set country_name = 'Argentina'
where country_name is null
  and upper(trim(country)) in ('AR', 'ARGENTINA');

update public.catalog_views
set country_name = trim(country)
where country_name is null
  and country is not null
  and length(trim(country)) > 2;

create index if not exists catalog_views_country_code_idx on public.catalog_views (country_code);
create index if not exists catalog_views_region_idx on public.catalog_views (region);

drop function if exists public.record_catalog_view(uuid, text, text);

create or replace function public.record_catalog_view(
  p_catalog_item_id uuid,
  p_country_code text default null,
  p_country_name text default null,
  p_region text default null,
  p_city text default null
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_published boolean;
  v_total bigint;
  v_country text;
begin
  select ci.published
  into v_published
  from public.catalog_items ci
  where ci.id = p_catalog_item_id;

  if v_published is distinct from true then
    raise exception 'Publicación no publicada o inexistente';
  end if;

  v_country := coalesce(nullif(trim(p_country_code), ''), nullif(trim(p_country_name), ''));

  insert into public.catalog_views (
    catalog_item_id,
    country,
    country_code,
    country_name,
    province,
    region,
    city
  )
  values (
    p_catalog_item_id,
    v_country,
    nullif(trim(p_country_code), ''),
    nullif(trim(p_country_name), ''),
    nullif(trim(p_region), ''),
    nullif(trim(p_region), ''),
    nullif(trim(p_city), '')
  );

  select count(*)::bigint
  into v_total
  from public.catalog_views
  where catalog_item_id = p_catalog_item_id;

  return v_total;
end;
$$;

revoke all on function public.record_catalog_view(uuid, text, text, text, text) from public;
grant execute on function public.record_catalog_view(uuid, text, text, text, text) to anon, authenticated;

create or replace function public.get_catalog_item_view_breakdown(p_item_id uuid)
returns table (
  country_code text,
  country_name text,
  region text,
  view_count bigint
)
language sql
security definer
set search_path = public
as $$
  select
    coalesce(
      nullif(trim(country_code), ''),
      case
        when upper(trim(country)) in ('AR', 'ARGENTINA') then 'AR'
        when country is not null and length(trim(country)) = 2 then upper(trim(country))
        else 'XX'
      end
    ) as country_code,
    coalesce(
      nullif(trim(country_name), ''),
      case
        when upper(trim(country)) in ('AR', 'ARGENTINA') then 'Argentina'
        when nullif(trim(country), '') is not null then trim(country)
        else 'Sin país'
      end
    ) as country_name,
    coalesce(
      nullif(trim(region), ''),
      nullif(trim(province), ''),
      'Sin región'
    ) as region,
    count(*)::bigint as view_count
  from public.catalog_views
  where catalog_item_id = p_item_id
  group by 1, 2, 3
  order by 4 desc, 2 asc, 3 asc;
$$;

create or replace function public.get_catalog_item_recent_views(
  p_item_id uuid,
  p_limit int default 12
)
returns table (
  viewed_at timestamptz,
  country_code text,
  country_name text,
  region text,
  city text
)
language sql
security definer
set search_path = public
as $$
  select
    cv.viewed_at,
    coalesce(nullif(trim(cv.country_code), ''), 'XX') as country_code,
    coalesce(
      nullif(trim(cv.country_name), ''),
      case
        when upper(trim(cv.country)) in ('AR', 'ARGENTINA') then 'Argentina'
        when nullif(trim(cv.country), '') is not null then trim(cv.country)
        else 'Sin país'
      end
    ) as country_name,
    coalesce(nullif(trim(cv.region), ''), nullif(trim(cv.province), ''), 'Sin región') as region,
    nullif(trim(cv.city), '') as city
  from public.catalog_views cv
  where cv.catalog_item_id = p_item_id
  order by cv.viewed_at desc
  limit greatest(p_limit, 1);
$$;

create or replace function public.get_all_catalog_item_geo_summary()
returns table (
  catalog_item_id uuid,
  country_code text,
  country_name text,
  region text,
  view_count bigint
)
language sql
security definer
set search_path = public
as $$
  select
    catalog_item_id,
    coalesce(
      nullif(trim(country_code), ''),
      case
        when upper(trim(country)) in ('AR', 'ARGENTINA') then 'AR'
        when country is not null and length(trim(country)) = 2 then upper(trim(country))
        else 'XX'
      end
    ) as country_code,
    coalesce(
      nullif(trim(country_name), ''),
      case
        when upper(trim(country)) in ('AR', 'ARGENTINA') then 'Argentina'
        when nullif(trim(country), '') is not null then trim(country)
        else 'Sin país'
      end
    ) as country_name,
    coalesce(nullif(trim(region), ''), nullif(trim(province), ''), 'Sin región') as region,
    count(*)::bigint as view_count
  from public.catalog_views
  group by catalog_item_id, 2, 3, 4
  order by catalog_item_id, 5 desc, 3 asc, 4 asc;
$$;

revoke all on function public.get_catalog_item_view_breakdown(uuid) from public;
revoke all on function public.get_catalog_item_recent_views(uuid, int) from public;
revoke all on function public.get_all_catalog_item_geo_summary() from public;

grant execute on function public.get_catalog_item_view_breakdown(uuid) to authenticated;
grant execute on function public.get_catalog_item_recent_views(uuid, int) to authenticated;
grant execute on function public.get_all_catalog_item_geo_summary() to authenticated;
