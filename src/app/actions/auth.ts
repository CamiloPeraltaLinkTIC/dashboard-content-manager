"use server";

import { getAuthenticatedSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const username = formData.get("email") as string; // Ahora recibimos username
  const password = formData.get("password") as string;
  const supabase = await getAuthenticatedSupabaseClient();

  // Convertimos username a Ghost Email usando @yopmail.com
  const ghostEmail = username.includes("@") ? username : `${username}@yopmail.com`;

  const { error } = await supabase.auth.signUp({
    email: ghostEmail,
    password,
    options: {
      data: {
        username: username.split("@")[0],
      },
    },
  });

  if (error) {
    return { error: error.message };
  }
  
  return { success: true };
}

export async function signIn(prevState: any, formData: FormData) {
  const username = formData.get("email") as string; // El campo sigue llamándose email en el form
  const password = formData.get("password") as string;
  const supabase = await getAuthenticatedSupabaseClient();

  // Convertimos username a Ghost Email internamente usando @yopmail.com
  const ghostEmail = username.includes("@") ? username : `${username}@yopmail.com`;

  const { error } = await supabase.auth.signInWithPassword({
    email: ghostEmail,
    password,
  });

  if (error) {
    return { error: "Credenciales de acceso incorrectas" };
  }
  
  redirect("/mapa");
}

export async function signOut() {
  const supabase = await getAuthenticatedSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}
