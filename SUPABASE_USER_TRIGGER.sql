-- Trigger para crear perfil automáticamente con rol 'reader' por defecto
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, user_role)
  VALUES (new.id, 'reader');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Limpiar trigger si existe para evitar duplicados
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
