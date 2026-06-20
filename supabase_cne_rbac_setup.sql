-- ============================================================================
-- CNE Tablero Narrativa · RBAC + control de acceso por pantalla
-- ----------------------------------------------------------------------------
-- Idempotente. Seguro de re-ejecutar. Comparte la MISMA base de datos Supabase
-- con el proyecto "dashboard-unificado" (auth.users, public.profiles y
-- public.user_screen_access son compartidas).
--
-- Las pantallas de ESTE tablero usan el prefijo 'cne-tab:' en screen_key para
-- NO chocar con las pantallas de unificado en la tabla compartida.
-- ============================================================================

-- 1) profiles: rol por usuario (1:1 con auth.users) -------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  user_role TEXT DEFAULT 'reader',
  full_name TEXT
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Roles permitidos: superadmin/admin/viewer (modelo actual) + reader/user (legado)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_role_check
  CHECK (user_role IN ('superadmin', 'admin', 'viewer', 'reader', 'user'));

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2) user_screen_access: pantallas permitidas por usuario -------------------
CREATE TABLE IF NOT EXISTS public.user_screen_access (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  screen_key TEXT NOT NULL,
  PRIMARY KEY (user_id, screen_key)
);
ALTER TABLE public.user_screen_access ENABLE ROW LEVEL SECURITY;

-- 3) Helpers (SECURITY DEFINER: evalúan rol saltando RLS) -------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND user_role IN ('admin', 'superadmin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND user_role = 'superadmin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4) Trigger: crea el perfil al registrarse un usuario en auth.users --------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, user_role, full_name)
  VALUES (
    new.id,
    'reader',  -- nace sin acceso a ningún módulo; el superadmin asigna pantallas
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'username')
  )
  ON CONFLICT (id) DO UPDATE
    SET full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5) RLS en profiles: cada quien ve su perfil; el superadmin gestiona todo ---
DROP POLICY IF EXISTS "cne perfil propio lectura" ON public.profiles;
CREATE POLICY "cne perfil propio lectura"
  ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_superadmin());

DROP POLICY IF EXISTS "cne superadmin gestiona perfiles" ON public.profiles;
CREATE POLICY "cne superadmin gestiona perfiles"
  ON public.profiles FOR ALL TO authenticated
  USING (public.is_superadmin()) WITH CHECK (public.is_superadmin());

-- 6) RLS en user_screen_access ----------------------------------------------
DROP POLICY IF EXISTS "cne acceso propio lectura" ON public.user_screen_access;
CREATE POLICY "cne acceso propio lectura"
  ON public.user_screen_access FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_superadmin());

DROP POLICY IF EXISTS "cne superadmin gestiona accesos" ON public.user_screen_access;
CREATE POLICY "cne superadmin gestiona accesos"
  ON public.user_screen_access FOR ALL TO authenticated
  USING (public.is_superadmin()) WITH CHECK (public.is_superadmin());

-- 7) Catálogo de pantallas de este tablero (referencia; el código es la fuente)
--    cne-tab:mapa              -> /mapa
--    cne-tab:elecciones        -> /elecciones
--    cne-tab:testigos          -> /testigos
--    cne-tab:legitimidad       -> /legitimidad
--    cne-tab:quiroz            -> /quiroz
--    cne-tab:medios            -> /medios
--    cne-tab:social            -> /social
--    cne-tab:actores-mapa      -> /actores-electorales/mapa-colombia
--    cne-tab:actores-perfiles  -> /actores-electorales/perfiles

-- 8) Designa el PRIMER superadmin (descomenta y pon el correo real) ----------
--    Para usuarios creados con "usuario" (sin @) el correo es usuario@yopmail.com.
-- UPDATE public.profiles p SET user_role = 'superadmin'
--   FROM auth.users u
--   WHERE u.id = p.id AND u.email = 'TU_CORREO@yopmail.com';
