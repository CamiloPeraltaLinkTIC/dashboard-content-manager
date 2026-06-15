-- =========================================================
-- SCRIPT CONSOLIDADO DE SEGURIDAD Y RLS
-- =========================================================

-- 1. Crear tabla de perfiles si no existe
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    user_role TEXT DEFAULT 'user' CHECK (user_role IN ('user', 'admin'))
);

-- 2. Habilitar RLS en perfiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

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

-- 4. Aplicar RLS a todas las tablas del dashboard
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
        'content_manager_medios_feed'
    ];
BEGIN
    FOREACH table_name IN ARRAY target_tables
    LOOP
        -- Habilitar RLS
        EXECUTE format('ALTER TABLE IF EXISTS %I ENABLE ROW LEVEL SECURITY', table_name);
        
        -- Limpiar políticas existentes para evitar duplicados
        EXECUTE format('DROP POLICY IF EXISTS "Lectura abierta para autenticados" ON %I', table_name);
        EXECUTE format('DROP POLICY IF EXISTS "Escritura solo para admins" ON %I', table_name);

        -- Crear políticas nuevas
        EXECUTE format('CREATE POLICY "Lectura abierta para autenticados" ON %I FOR SELECT TO authenticated USING (true)', table_name);
        EXECUTE format('CREATE POLICY "Escritura solo para admins" ON %I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', table_name);
    END LOOP;
END $$;
