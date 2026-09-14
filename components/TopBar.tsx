"use client";

import { Search, } from "lucide-react";

export default function TopBar({ title = "Task Management" }: { title?: string }) {
  return (
    <header className="flex items-center justify-between px-10 py-6">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>

      <div className="flex items-center gap-5">
        <div className="relative">
          
        </div>
      </div>
    </header>
  );
}