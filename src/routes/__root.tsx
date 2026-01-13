import * as React from "react";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import type { User } from "@/lib/types.ts";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/layout/app-sidebar.tsx";
import { AppHeader } from "@/components/layout/app-header.tsx";
import { AlertCircle, FileQuestion, Home, RefreshCw } from "lucide-react";
import { ModeToggle } from "@/components/theme/mode-toggle.tsx";

export interface RouterContext {
  auth: {
    isAuthenticated: boolean;
    user: User | null;
  };
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  errorComponent: GlobalErrorComponent,
  notFoundComponent: NotFoundComponent,
  pendingComponent: LoadingComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset className="flex flex-col h-screen overflow-hidden">
          <AppHeader />
          <main className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </main>
        </SidebarInset>
        <ModeToggle />
      </SidebarProvider>
    </React.Fragment>
  );
}

function GlobalErrorComponent({ error }: { error: Error }) {
  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl p-8 text-center shadow-xl border border-gray-100 dark:border-slate-800">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-rose-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          문제가 발생했습니다
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm">
          {error.message ||
            "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all font-medium"
          >
            <RefreshCw size={18} />
            새로고침
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200 dark:shadow-none transition-all font-medium"
          >
            <Home size={18} />
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-slate-950">
      <div className="max-w-md w-full text-center">
        <div className="relative inline-block mb-8">
          <h1 className="text-9xl font-black text-slate-100 dark:text-slate-900 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <FileQuestion
              size={80}
              className="text-indigo-600 dark:text-indigo-500 opacity-90"
            />
          </div>
        </div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          길을 잃으신 것 같아요
        </p>
        <p className="text-slate-500 dark:text-slate-400 mb-10">
          찾으시는 페이지가 삭제되었거나 주소가 잘못되었습니다.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-100 dark:shadow-none transition-all"
        >
          <Home size={20} />
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

function LoadingComponent() {
  return (
    <div className="flex-1 flex items-center justify-center bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-100 dark:border-indigo-900 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 animate-pulse">
          잠시만 기다려주세요...
        </p>
      </div>
    </div>
  );
}
