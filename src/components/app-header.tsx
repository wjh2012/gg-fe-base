import { SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { Link } from "@tanstack/react-router";

export function AppHeader() {
  return (
    <header className="border-b bg-background sticky top-0 z-30">
      <div className="flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <SidebarTrigger />
          <Link to="/" className="text-xl font-bold text-indigo-600">
            GG APP
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              to="/dashboard"
              className="text-sm font-medium hover:text-indigo-600 transition-colors"
            >
              대시보드
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
