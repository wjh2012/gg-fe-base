// API 기본 응답 타입
export interface BaseResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: ErrorDetail[];
  };
  meta?: {
    timestamp?: string;
    requestId?: string;
  };
}

export interface ErrorDetail {
  target: string;
  message: string;
}

// 인증 관련 타입
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface RegisterResponse {
  id: string;
  name: string;
}

// 사용자 타입
export interface User {
  id: string;
  name: string;
}
