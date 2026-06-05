"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEye } from "@fortawesome/free-solid-svg-icons";

type Role = "admin" | "viewer" | null;

interface AuthContextType {
  role: Role;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ role: null, logout: () => {} });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false); // To avoid localStorage hydration mismatch

  useEffect(() => {
    const savedRole = localStorage.getItem("cne_dashboard_role") as Role;
    if (savedRole) {
      setRole(savedRole);
    }
    setIsReady(true);
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD) {
      setRole("admin");
      localStorage.setItem("cne_dashboard_role", "admin");
      setError("");
    } else if (password === process.env.NEXT_PUBLIC_DASHBOARD_VIEWER_PASSWORD) {
      setRole("viewer");
      localStorage.setItem("cne_dashboard_role", "viewer");
      setError("");
    } else {
      setError("Clave de acceso incorrecta");
    }
  };

  const logout = () => {
    setRole(null);
    setPassword("");
    localStorage.removeItem("cne_dashboard_role");
  };

  if (!isReady) return null;

  if (!role) {
    return (
      <div className="h-screen w-full bg-[#03060d] flex items-center justify-center font-sans antialiased relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[30rem] h-[30rem] bg-purple-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="z-10 bg-[#0b101d]/80 backdrop-blur-xl border border-white/10 p-10 rounded-3xl w-full max-w-md shadow-2xl flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-blue-500/20">
            <span className="text-3xl font-bold drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] text-white">CNE</span>
          </div>
          
          <h1 className="text-2xl font-black mb-1 tracking-tight text-white">Tablero de Narrativa</h1>
          <p className="text-slate-400 mb-8 text-center text-sm">Ingrese su clave para acceder a los tableros analíticos del proceso electoral</p>
          
          <form className="w-full space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Reserva del acceso</label>
              <div className="relative">
                <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <Input 
                  type="password" 
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-[#161d2b] border-white/10 text-white rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all font-mono"
                />
              </div>
            </div>
            
            {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}
            
            <Button 
                type="submit" 
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/20 transition-all mt-4"
            >
              Ingresar al Tablero
            </Button>
          </form>
          
          <div className="mt-8 flex items-center justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faEye} /> Solo lectura</span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faLock} /> Admin</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ role, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
