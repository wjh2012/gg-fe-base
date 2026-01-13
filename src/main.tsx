import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/pretendard/index.css";
import "@fontsource/pretendard/400.css";
import "@fontsource/pretendard/400-italic.css";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client.ts";
import { App } from "@/App.tsx";
import { ThemeProvider } from "@/components/theme/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
