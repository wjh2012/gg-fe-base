import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getToken, removeToken, setToken } from "../utils/token";
import type { BaseResponse, TokenResponse } from "./types";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // refreshToken 쿠키 전송
});

// 토큰 갱신 상태 관리
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// 토큰 갱신 함수
async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await axios.post<BaseResponse<TokenResponse>>(
      `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/auth/refresh`,
      {},
      { withCredentials: true },
    );
    if (response.data.success && response.data.data) {
      const newToken = response.data.data.accessToken;
      setToken(newToken);
      return newToken;
    }
    return null;
  } catch {
    return null;
  }
}

// 요청 인터셉터 - 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터 - 401 에러 시 토큰 갱신 시도
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 에러이고 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      // refresh 요청 자체가 실패한 경우 로그인으로
      if (originalRequest.url?.includes("/auth/refresh")) {
        removeToken();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // 이미 갱신 중이면 대기
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const newToken = await refreshAccessToken();
      isRefreshing = false;

      if (newToken) {
        onTokenRefreshed(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }

      // 갱신 실패 시 로그인으로
      removeToken();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);
