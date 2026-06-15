-- =========================================================
-- SCRIPT DE EMERGENCIA: DESACTIVAR RLS EN TODAS LAS TABLAS
-- =========================================================

DO $$
DECLARE
    table_name TEXT;
    target_tables TEXT[] := ARRAY[
        'content_manager_quiroz_profile',
        'content_manager_quiroz_apariciones',
        'content_manager_quiroz_strategy',
        'content_manager_social_profiles',
        'content_manager_social_feed',
        'content_manager_medios_profiles',
        'content_manager_medios_feed',
        'content_manager_elecciones_kpis',
        'content_manager_elecciones_calendario',
        'content_manager_elecciones_strategy',
        'content_manager_elecciones_participacion',
        'content_manager_legitimidad_indices',
        'content_manager_legitimidad_certificaciones',
        'content_manager_legitimidad_acciones',
        'content_manager_legitimidad_strategy',
        'content_manager_mapa_countries',
        'content_manager_globe_markers',
        'content_manager_calendario_electoral',
        'content_manager_testigos_kpis',
        'content_manager_testigos_deptos',
        'content_manager_testigos_misiones',
        'content_manager_testigos_strategy',
        'public.profiles'
    ];
BEGIN
    FOREACH table_name IN ARRAY target_tables
    LOOP
        -- Ejecutar solo si la tabla existe
        IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = table_name OR (table_name = 'public.profiles' AND schemaname = 'public' AND tablename = 'profiles')) THEN
            EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', table_name);
            RAISE NOTICE 'RLS desactivado para la tabla: %', table_name;
        END IF;
    END LOOP;
END $$;
