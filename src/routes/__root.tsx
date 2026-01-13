import * as React from "react";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { User } from "@/lib/types.ts";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/layout/app-sidebar.tsx";
import { AppHeader } from "@/components/layout/app-header.tsx";

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
        <SidebarInset>
          <AppHeader />
          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </React.Fragment>
  );
}
