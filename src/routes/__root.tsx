import * as React from "react";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { User } from "@/lib/types.ts";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/app-sidebar.tsx";

export interface RouterContext {
  auth: {
    isAuthenticated: boolean;
    user: User | null;
  };
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <Outlet />
        </main>
      </SidebarProvider>
    </React.Fragment>
  );
}
