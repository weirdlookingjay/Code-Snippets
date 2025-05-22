"use client";

import { Setup } from "@/components/utils";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { ThemeProvider } from "@/components/ThemeProvider";
import Provider from "@/redux/provider";
import { usePathname } from "next/navigation";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { Loader2 } from "lucide-react";

function NavWrapper({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { data: user, isLoading, isFetching } = useRetrieveUserQuery();
  const isAuthPage = path.startsWith("/auth/login") || path.startsWith("/auth/register");
  const isHome = path === "/";
  const isAuthenticated = !!user;
  const hideNav = isAuthPage || (isHome && !isAuthenticated);

  if (isLoading || isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return hideNav ? (
    <main className="min-h-screen flex items-center justify-center bg-background">{children}</main>
  ) : (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-4 md:p-8 bg-background">{children}</main>
      </div>
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Provider>
        <Setup />
        <NavWrapper>{children}</NavWrapper>
      </Provider>
    </ThemeProvider>
  );
}
