import { redirect } from "next/navigation";
import { getServerAccess } from "@/lib/auth/access";
import { firstAllowedPath } from "@/lib/auth/rbac";

// El proxy normalmente ya redirige "/", pero dejamos esta resolución
// server-side como defensa en profundidad.
export default async function Home() {
  const access = await getServerAccess();
  if (!access) redirect("/login");
  const landing = firstAllowedPath(access);
  redirect(landing ?? "/sin-acceso");
}
