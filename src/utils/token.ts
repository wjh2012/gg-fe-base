let accessToken: string | null = null;

export function getToken(): string | null {
  return accessToken;
}

export function setToken(token: string): void {
  accessToken = token;
}

export function removeToken(): void {
  accessToken = null;
}

export function hasToken(): boolean {
  return !!accessToken;
}
