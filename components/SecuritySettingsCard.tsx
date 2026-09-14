"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import Toggle from "./Toggle";

export default function SecuritySettingsCard() {
  const [twoFactor, setTwoFactor] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdatePassword = () => {
    // Wire this up to POST /api/users/me/password once the backend is in place.
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <Lock size={18} className="text-blue-600" />
        <h2 className="text-xl font-bold text-slate-900">Security</h2>
      </div>

      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div>
          <p className="text-sm font-medium text-slate-800">Two-factor authentication</p>
          <p className="mt-0.5 text-sm text-slate-500">
            Require a verification code in addition to your password.
          </p>
        </div>
        <Toggle
          checked={twoFactor}
          onChange={() => setTwoFactor((v) => !v)}
          label="Two-factor authentication"
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-400">
            CURRENT PASSWORD
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-400">
            NEW PASSWORD
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        onClick={handleUpdatePassword}
        disabled={!currentPassword || !newPassword}
        className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Update password
      </button>
    </div>
  );
}