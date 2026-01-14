import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { clearAccessToken, setAccessToken } from "../lib/auth";
import api from "../lib/api";
import type { User } from "@/lib/types.ts";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isInitializing: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const queryClient = useQueryClient();

  // 앱 부팅 시 토큰 복구 (Silent Refresh)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await api.post("/auth/refresh");
        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch {
        clearAccessToken();
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(
    async (credentials: { username: string; password: string }) => {
      const { data } = await api.post("/auth/login", credentials);
      setAccessToken(data.accessToken);
      setUser(data.user);
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      clearAccessToken();
      setUser(null);
      queryClient.clear();
    }
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isInitializing,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
