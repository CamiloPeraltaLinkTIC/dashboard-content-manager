-- ============================================================
-- Perfiles de usuario: nombre visible + rol coherente
-- Ejecutar en el SQL Editor de Supabase.
-- ============================================================

-- 1) Columna para el nombre que se muestra en los dashboards ("Hola, <nombre>")
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;

-- 2) Permite el rol 'reader' (el que asigna el trigger) además de user/admin
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_role_check
  CHECK (user_role IN ('user', 'admin', 'reader'));

-- 3) Política de lectura del propio perfil
--    (necesaria para que el rol y el nombre se puedan leer desde el cliente)
DROP POLICY IF EXISTS "Usuarios pueden leer su propio perfil" ON public.profiles;
CREATE POLICY "Usuarios pueden leer su propio perfil"
  ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());

-- 4) Trigger: al crear un usuario en auth.users, crea su perfil copiando el nombre
--    (full_name) o el usuario (username) desde la metadata.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, user_role, full_name)
  VALUES (
    new.id,
    'reader',
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

-- 5) (Opcional) Backfill: pon el nombre a usuarios que ya existen.
--    Repite/ajusta una línea por usuario ya creado.
-- UPDATE public.profiles p
--   SET full_name = 'Cristian Sabogal'
--   FROM auth.users u
--  WHERE u.id = p.id AND u.email = 'admin_cne@yopmail.com';
