import { RouterProvider } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth.ts";
import { router } from "@/router.tsx";

export function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <RouterProvider
      router={router}
      context={{
        auth: { isAuthenticated, user },
      }}
    />
  );
}
