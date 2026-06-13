// ============================================================
// Crea usuarios en Supabase Auth con nombre visible y rol.
//
// Requisitos:
//   1) Ejecuta antes en Supabase el SQL: supabase_perfiles_nombre.sql
//   2) Agrega tu SUPABASE_SERVICE_ROLE_KEY en un archivo .env.local
//      (Supabase → Project Settings → API → service_role secret).
//      NUNCA subas esa clave al repo ni la expongas en el front.
//
// Uso (desde la carpeta del proyecto):
//   node scripts/crear-usuarios.mjs
// ============================================================

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// ---- 1. Define aquí los usuarios a crear --------------------------------
// usuario  -> con lo que inician sesión (sin @ se convierte en usuario@yopmail.com)
// nombre   -> el que se muestra en los dashboards ("Hola, <nombre>")
// rol      -> "admin" (puede editar) o "reader" (solo lectura)
const USERS = [
  { usuario: "usuario1", nombre: "Nombre Apellido 1", password: "CAMBIA_ESTA_CLAVE_1", rol: "reader" },
  { usuario: "usuario2", nombre: "Nombre Apellido 2", password: "CAMBIA_ESTA_CLAVE_2", rol: "reader" },
];
// -------------------------------------------------------------------------

// Carga variables desde .env y .env.local (sin dependencias externas)
function loadEnv() {
  const env = {};
  for (const file of [".env", ".env.local"]) {
    try {
      for (const line of readFileSync(file, "utf8").split("\n")) {
        const t = line.trim();
        if (!t || t.startsWith("#")) continue;
        const i = t.indexOf("=");
        if (i === -1) continue;
        env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
      }
    } catch { /* archivo opcional */ }
  }
  return { ...env, ...process.env };
}

const env = loadEnv();
const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !SERVICE_KEY) {
  console.error("Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
  console.error("Agrega SUPABASE_SERVICE_ROLE_KEY en .env.local y vuelve a intentar.");
  process.exit(1);
}

const admin = createClient(URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const toEmail = (usuario) => (usuario.includes("@") ? usuario : `${usuario}@yopmail.com`);

for (const u of USERS) {
  const email = toEmail(u.usuario);
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: u.password,
    email_confirm: true, // sin paso de verificación por correo
    user_metadata: { full_name: u.nombre, username: u.usuario },
  });

  if (error) {
    console.error(`✗ ${u.usuario} (${email}): ${error.message}`);
    continue;
  }

  // Asigna nombre y rol en profiles (sobrescribe lo que puso el trigger por defecto)
  const { error: pErr } = await admin
    .from("profiles")
    .upsert({ id: data.user.id, user_role: u.rol, full_name: u.nombre }, { onConflict: "id" });

  if (pErr) {
    console.error(`✓ ${u.usuario} creado, pero falló el perfil: ${pErr.message}`);
  } else {
    console.log(`✓ ${u.usuario} creado  ·  email: ${email}  ·  rol: ${u.rol}  ·  nombre: ${u.nombre}`);
  }
}

console.log("Listo.");
