-- =========================================================
-- SCRIPT ÚNICO: CONFIGURACIÓN COMPLETA DE SEGURIDAD (TODAS LAS TABLAS)
-- =========================================================

-- 1. Crear tabla de perfiles (Si no existe)
-- Se ajusta el CHECK para permitir 'admin' y 'reader'
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    user_role TEXT DEFAULT 'reader' CHECK (user_role IN ('reader', 'admin'))
);

-- 2. Asegurar que RLS esté desactivado en perfiles para configuración
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 3. Crear función de verificación de administrador
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND user_role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Limpieza y Reconfiguración de TODAS las tablas
DO $$
DECLARE
    table_name TEXT;
    policy_record RECORD;
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
        'content_manager_testigos_strategy'
    ];
BEGIN
    FOREACH table_name IN ARRAY target_tables
    LOOP
        IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = table_name) THEN
            EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', table_name);
            
            FOR policy_record IN 
                SELECT policyname 
                FROM pg_policies 
                WHERE tablename = table_name 
                AND schemaname = 'public'
            LOOP
                EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_record.policyname, table_name);
            END LOOP;
            
            EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
            
            EXECUTE format('CREATE POLICY "Lectura abierta para autenticados" ON %I FOR SELECT TO authenticated USING (true)', table_name);
            EXECUTE format('CREATE POLICY "Escritura solo para admins" ON %I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', table_name);
            
            RAISE NOTICE 'RLS reconfigurado para la tabla: %', table_name;
        END IF;
    END LOOP;
END $$;
