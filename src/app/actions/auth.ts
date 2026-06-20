"use server";

import { getAuthenticatedSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export type AuthState = {
  error: string | null;
  success?: boolean;
};

export async function signUp(formData: FormData): Promise<AuthState> {
  const username = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await getAuthenticatedSupabaseClient();

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
  
  return { error: null, success: true };
}

export async function signIn(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const username = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await getAuthenticatedSupabaseClient();

  const ghostEmail = username.includes("@") ? username : `${username}@yopmail.com`;

  const { error } = await supabase.auth.signInWithPassword({
    email: ghostEmail,
    password,
  });

  if (error) {
    return { error: "Credenciales de acceso incorrectas" };
  }

  // El proxy resuelve la primera pantalla permitida (o /sin-acceso).
  redirect("/");
}

export async function signOut() {
  const supabase = await getAuthenticatedSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}
