import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "@/router.tsx";
import { useSearch } from "@tanstack/react-router";

export function useLogin() {
  const { login } = useAuth();
  const search = useSearch({ strict: false });

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      const redirectTo = (search as { redirect?: string }).redirect || "/";
      router.navigate({ to: redirectTo });
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
