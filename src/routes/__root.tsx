import * as React from "react";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { User } from "@/lib/types.ts";

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
      <Outlet />
    </React.Fragment>
  );
}
