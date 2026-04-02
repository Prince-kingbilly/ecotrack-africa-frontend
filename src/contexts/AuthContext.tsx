import { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";

type User = { id: number; display_name: string; email: string; role: string };

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.setToken(token);
      // TODO: Validate token and get user info
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.post<{ user: User; token: string }>("/auth/login", { email, password });
    api.setToken(data.token);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    api.setToken(null);
    localStorage.removeItem("token");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};