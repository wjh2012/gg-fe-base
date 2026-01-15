// 메모리에만 저장되는 변수 (클로저/모듈 스코프)
// 페이지 새로고침 시 초기화
let accessToken: string | null = null;

/**
 * 새로운 Access Token을 메모리에 저장합니다.
 * 로그인 성공 시 또는 토큰 재발급(Refresh) 성공 시 호출합니다.
 */
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

/**
 * 현재 저장된 Access Token을 반환합니다.
 * 주로 Axios 인터셉터에서 헤더에 토큰을 붙일 때 사용합니다.
 */
export const getAccessToken = () => {
  return accessToken;
};

/**
 * 토큰 존재 여부를 확인합니다.
 */
export const hasToken = () => {
  return !!accessToken;
};

/**
 * 로그아웃 시 호출하여 메모리의 토큰을 비웁니다.
 */
export const clearAccessToken = () => {
  accessToken = null;
};
