import { createContext, type ReactNode, useCallback, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { clearAccessToken, setAccessToken } from "../lib/auth/token.ts";
import apiClient from "../lib/api/api-client.ts";
import type { User } from "@/lib/types.ts";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user = null, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const { data } = await apiClient.post("/auth/refresh");
        setAccessToken(data.accessToken);
        return data.user as User;
      } catch {
        clearAccessToken();
        return null;
      }
    },
    staleTime: Infinity,
    retry: false,
  });

  const login = useCallback(
    async (credentials: { username: string; password: string }) => {
      const { data } = await apiClient.post("/auth/login", credentials);
      setAccessToken(data.accessToken);
      queryClient.setQueryData(["auth", "me"], data.user);
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      clearAccessToken();
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.clear();
    }
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: user !== null,
        isLoading,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export type { AuthContextType };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
