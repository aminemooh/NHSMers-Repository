"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isLogged = localStorage.getItem("isAdminLoggedIn") === "true";
    setUser(isLogged ? { uid: 'admin' } as any : null);
    setLoading(false);

    if (!isLogged && pathname !== "/admin/login") {
      router.push("/admin/login");
    }

    if (isLogged && pathname === "/admin/login") {
      router.push("/admin");
    }
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p>Loading...</p>
      </div>
    );
  }

  // If not logged in and not on login page, don't render children while redirecting
  if (!user && pathname !== "/admin/login") {
    return null;
  }

  return <>{children}</>;
}
