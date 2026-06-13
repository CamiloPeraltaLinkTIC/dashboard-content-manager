"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Role = "admin" | "reader" | null;

interface AuthContextType {
  user: any;
  role: Role;
  firstName: string;
}

const AuthContext = createContext<AuthContextType>({ user: null, role: null, firstName: "" });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<Role>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const resolveFirstName = (u: any) => {
    const full = u?.user_metadata?.full_name || u?.user_metadata?.name || u?.email || "";
    return full.split(/[\s@]/)[0] || "";
  };

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("user_role")
          .eq("id", session.user.id)
          .single();

        setRole(profile?.user_role || "reader");
        setFirstName(resolveFirstName(session.user));
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (session) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("user_role")
          .eq("id", session.user.id)
          .single();
        setRole(profile?.user_role || "reader");
        setFirstName(resolveFirstName(session.user));
      } else {
        setUser(null);
        setRole(null);
        setFirstName("");
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, firstName }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
