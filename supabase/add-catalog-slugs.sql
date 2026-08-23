-- Slugs SEO para publicaciones del catálogo
-- Ejecutar en Supabase SQL Editor después de deploy del código.

create or replace function public.slugify_text(input text)
returns text
language plpgsql
immutable
as $$
declare
  result text;
begin
  result := lower(coalesce(input, ''));
  result := translate(
    result,
    'áàäâãåéèëêíìïîóòöôõúùüûñç',
    'aaaaaaeeeeiiiiooooouuuunc'
  );
  result := regexp_replace(result, '[^a-z0-9\s-]', '', 'g');
  result := regexp_replace(trim(result), '\s+', '-', 'g');
  result := regexp_replace(result, '-+', '-', 'g');
  result := trim(both '-' from result);

  if result = '' then
    result := 'publicacion';
  end if;

  return result;
end;
$$;

alter table public.catalog_items
  add column if not exists slug text;

create unique index if not exists catalog_items_slug_unique_idx
  on public.catalog_items (slug)
  where slug is not null;

-- Poblar slugs de publicaciones existentes
do $$
declare
  item record;
  base_slug text;
  final_slug text;
  counter integer;
begin
  for item in
    select id, titulo
    from public.catalog_items
    where slug is null or trim(slug) = ''
    order by created_at asc
  loop
    base_slug := public.slugify_text(item.titulo);
    final_slug := base_slug;
    counter := 2;

    while exists (
      select 1
      from public.catalog_items
      where slug = final_slug
        and id <> item.id
    ) loop
      final_slug := base_slug || '-' || counter::text;
      counter := counter + 1;
    end loop;

    update public.catalog_items
    set slug = final_slug
    where id = item.id;
  end loop;
end $$;

alter table public.catalog_items
  alter column slug set not null;

create index if not exists catalog_items_slug_idx
  on public.catalog_items (slug);
