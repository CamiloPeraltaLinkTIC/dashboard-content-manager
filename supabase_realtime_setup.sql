-- ============================================================
-- Supabase Realtime · Actualización automática de los mapas
-- Agrega las tablas de los mapas a la publicación `supabase_realtime` para que
-- las vistas (/mapa y /nacional) se refresquen apenas entran datos nuevos, sin
-- recargar la página y desde cualquier dispositivo.
--
-- La autorización la sigue controlando RLS: cada tabla ya tiene una política de
-- lectura para usuarios autenticados, así que solo reciben eventos quienes
-- pueden leer las filas. Ejecutar una sola vez (es idempotente).
-- ============================================================

DO $$
DECLARE
    t text;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'content_manager_mapa_countries',        -- Mapa Global (CNE)
        'content_manager_globe_markers',         -- Marcadores del globo
        'content_manager_nacional_departamentos' -- Conversación Nacional (CNE)
    ]
    LOOP
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables
            WHERE pubname = 'supabase_realtime'
              AND schemaname = 'public'
              AND tablename = t
        ) THEN
            EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
        END IF;
    END LOOP;
END $$;

-- Verificación: lista las tablas de los mapas habilitadas para Realtime.
-- SELECT tablename FROM pg_publication_tables
-- WHERE pubname = 'supabase_realtime' AND schemaname = 'public'
--   AND tablename IN ('content_manager_mapa_countries','content_manager_globe_markers','content_manager_nacional_departamentos');
