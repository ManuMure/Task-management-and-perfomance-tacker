"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useAuth } from "@/context/AuthContext";

export default function DashboardShell({
  title,
  children,
  contentClassName = "flex flex-col gap-6",
}: {
  title: string;
  children: React.ReactNode;
  contentClassName?: string;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Avoid flashing protected content before the auth check resolves.
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EEF2FA]">
        <p className="text-sm text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#EEF2FA]">
      <Sidebar />
      <main className="flex-1 px-10 pb-10">
        <TopBar title={title} />
        <div className={contentClassName}>{children}</div>
      </main>
    </div>
  );
}