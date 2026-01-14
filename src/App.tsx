import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/router.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";

export function App() {
  const auth = useAuth();

  if (auth.isInitializing) return null;

  return <RouterProvider router={router} context={{ auth }} />;
}
