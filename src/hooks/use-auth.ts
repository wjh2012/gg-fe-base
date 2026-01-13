import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { api } from "../lib/api";
import type {
  BaseResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  TokenResponse,
  User,
} from "../lib/types";
import { getToken, removeToken, setToken } from "../utils/token";

async function tryRefreshToken(): Promise<boolean> {
  if (getToken()) return true;

  try {
    const response = await axios.post<BaseResponse<TokenResponse>>(
      `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/auth/refresh`,
      {},
      { withCredentials: true },
    );
    if (response.data.success && response.data.data) {
      setToken(response.data.data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// 현재 사용자 조회 (자동으로 토큰 갱신 시도)
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      // 토큰이 없으면 먼저 refresh 시도
      if (!getToken()) {
        const refreshed = await tryRefreshToken();
        if (!refreshed) {
          throw new Error("Not authenticated");
        }
      }

      const response = await api.get<BaseResponse<User>>("/auth/me");
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error?.message || "Failed to get user");
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

// 로그인
export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await api.post<BaseResponse<TokenResponse>>(
        "/auth/login",
        data,
      );
      return response.data;
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        setToken(response.data.accessToken);
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        navigate({ to: "/" });
      } else {
        console.error("Login failed:", response.error?.message);
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};

// 회원가입
export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await api.post<BaseResponse<RegisterResponse>>(
        "/auth/register",
        data,
      );
      return response.data;
    },
    onSuccess: (response) => {
      if (response.success) {
        navigate({ to: "/login" });
      } else {
        console.error("Register failed:", response.error?.message);
      }
    },
    onError: (error) => {
      console.error("Register error:", error);
    },
  });
};

// 로그아웃
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      // 서버에 로그아웃 요청 (refreshToken 쿠키 삭제)
      await api.post("/auth/logout");
    } catch {
      // 로그아웃 실패해도 클라이언트는 정리
    }
    removeToken();
    queryClient.clear();
    navigate({ to: "/login" });
  };

  return { logout };
};

// 인증 상태 확인
export const useAuth = () => {
  const { data: user, isLoading, error } = useCurrentUser();
  const { logout } = useLogout();

  return {
    user: user ?? null,
    isAuthenticated: !!user && !error,
    isLoading,
    logout,
  };
};
