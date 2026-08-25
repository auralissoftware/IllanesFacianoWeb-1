-- Permisos de lectura admin para el panel de administración
-- Ejecutar en el SQL Editor de Supabase

drop policy if exists "Admins can read all catalog items" on public.catalog_items;
create policy "Admins can read all catalog items"
  on public.catalog_items
  for select
  to authenticated
  using (true);

drop policy if exists "Admins can read all catalog media" on public.catalog_media;
create policy "Admins can read all catalog media"
  on public.catalog_media
  for select
  to authenticated
  using (true);
