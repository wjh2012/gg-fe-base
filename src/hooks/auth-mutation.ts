import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "@/router.tsx";

export function useLogin() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      // React 리렌더 후에 invalidate 실행
      setTimeout(() => router.invalidate(), 0);
    },
  });
}

export function useLogout() {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      router.invalidate();
    },
  });
}
