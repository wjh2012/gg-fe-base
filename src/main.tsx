import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/pretendard/index.css";
import "@fontsource/pretendard/400.css";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client.ts";
import { App } from "@/App.tsx";
import { ThemeProvider } from "@/components/theme/theme-provider.tsx";
import { AuthProvider } from "@/contexts/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
