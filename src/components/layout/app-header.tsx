import { SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { Link } from "@tanstack/react-router";
import { navigation } from "@/lib/navigation.ts";
import { useIsMobile } from "@/hooks/use-mobile.ts";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useLogout } from "@/hooks/auth-mutation.ts";

export function AppHeader() {
  const isMobile = useIsMobile();
  const { isAuthenticated, isLoading: isInitializing } = useAuth();
  const { mutate: logout } = useLogout();

  return (
    <header className="border-b bg-background sticky top-0 z-30">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="flex w-full items-center gap-8">
          <SidebarTrigger />
          <Link to="/" className="text-xl font-bold text-indigo-600">
            GG APP
          </Link>
          <NavigationMenu viewport={isMobile}>
            <NavigationMenuList className="flex-wrap">
              {navigation.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.items?.length ? (
                    <>
                      <NavigationMenuTrigger>
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-48 gap-1 p-2">
                          {item.items.map((subItem) => (
                            <li key={subItem.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  to={subItem.url}
                                  className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  {subItem.title}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <Link
                        to={item.url}
                        className={navigationMenuTriggerStyle()}
                      >
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <div className="ml-auto flex items-center gap-2">
            {isInitializing ? null : isAuthenticated ? (
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                로그아웃
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  로그인
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
