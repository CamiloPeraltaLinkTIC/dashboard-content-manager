import { NextResponse } from "next/server";
import { getServerAccess } from "@/lib/auth/access";

/** Acceso del usuario actual. Lo usa AccessSync para detectar cambios en vivo. */
export async function GET() {
  const access = await getServerAccess();
  if (!access) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  return NextResponse.json({
    role: access.role,
    screens: access.screens,
    name: access.name,
    email: access.email,
  });
}
