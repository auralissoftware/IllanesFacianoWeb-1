grant usage on schema public to anon, authenticated;

grant select on public.catalog_items to anon, authenticated;
grant insert, update, delete on public.catalog_items to authenticated;

grant select on public.catalog_media to anon, authenticated;
grant insert, delete on public.catalog_media to authenticated;
