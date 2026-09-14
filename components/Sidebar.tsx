"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  UserCheck,
  TrendingUp,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Task Queue", href: "/task-queue", icon: ClipboardList },
  { label: "Registrations", href: "/registrations", icon: UserCheck },
  { label: "Performance", href: "/performance", icon: TrendingUp },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col bg-slate-900">
      <div>
        <div className="mb-8 px-3">
          <h1 className="text-xl font-bold text-white">BRS Admin</h1>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <Icon size={18} strokeWidth={2} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <Link
        href="/settings"
        className={`flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium ${
          pathname === "/settings"
            ? "bg-blue-600 text-white"
            : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
        }`}
      >
        <Settings size={18} strokeWidth={2} />
        Settings
      </Link>
    </aside>
  );
}