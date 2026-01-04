"use client";

import { LoadingScreen } from "@/components/ui/loading-screen";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, dbUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in -> Login
        router.push("/login?from=/admin");
      } else if (dbUser && dbUser.role !== "ADMIN") {
        // Logged in but not admin -> Home (with maybe a toast/alert ideally, but redirect is fine)
        router.push("/");
      }
    }
  }, [user, dbUser, loading, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  // Authorize if user exists AND dbUser is loaded AND role is ADMIN
  if (!user || !dbUser || dbUser.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}
