"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SessionCard() {
  const [confirming, setConfirming] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Session</h2>
      <p className="mt-1 text-sm text-slate-500">
        Signed in as{" "}
        <span className="font-medium text-slate-700">
          {user?.email ?? "unknown"}
        </span>
      </p>

      <div className="mt-5 border-t border-slate-100 pt-5">
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} />
            Log out
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-700">Log out of this account?</p>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Yes, log out
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}