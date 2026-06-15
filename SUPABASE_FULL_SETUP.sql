-- =========================================================
-- SCRIPT ÚNICO: CONFIGURACIÓN COMPLETA DE PERFILES Y RLS
-- =========================================================

-- 1. Crear tabla de perfiles (Si no existe)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    user_role TEXT DEFAULT 'user' CHECK (user_role IN ('user', 'admin'))
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

-- 4. Limpieza y Reconfiguración de tablas de datos
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
        'content_manager_medios_feed'
    ];
BEGIN
    FOREACH table_name IN ARRAY target_tables
    LOOP
        -- Desactivar RLS
        EXECUTE format('ALTER TABLE IF EXISTS %I DISABLE ROW LEVEL SECURITY', table_name);
        
        -- Eliminar todas las políticas existentes
        FOR policy_record IN 
            SELECT policyname 
            FROM pg_policies 
            WHERE tablename = table_name 
            AND schemaname = 'public'
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_record.policyname, table_name);
        END LOOP;
        
        -- Habilitar RLS nuevamente
        EXECUTE format('ALTER TABLE IF EXISTS %I ENABLE ROW LEVEL SECURITY', table_name);
        
        -- Aplicar nuevas políticas
        EXECUTE format('CREATE POLICY "Lectura abierta para autenticados" ON %I FOR SELECT TO authenticated USING (true)', table_name);
        EXECUTE format('CREATE POLICY "Escritura solo para admins" ON %I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', table_name);
        
        RAISE NOTICE 'RLS reconfigurado para la tabla: %', table_name;
    END LOOP;
END $$;
