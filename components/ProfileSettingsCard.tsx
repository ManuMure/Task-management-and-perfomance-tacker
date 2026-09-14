"use client";

import { useState } from "react";
import { User } from "lucide-react";

export default function ProfileSettingsCard() {
  const [name, setName] = useState("Jordan Shaw");
  const [email, setEmail] = useState("jordan.shaw@brsadmin.com");
  const [role] = useState("Senior Filing Specialist");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Wire this up to PATCH /api/users/me once the backend is in place.
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <User size={18} className="text-blue-600" />
        <h2 className="text-xl font-bold text-slate-900">Profile</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-semibold text-white">
          JS
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">Profile photo</p>
          <button className="mt-1 text-sm font-medium text-blue-600 hover:underline">
            Change photo
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-400">
            FULL NAME
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-400">
            EMAIL
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-400">
            ROLE
          </label>
          <input
            type="text"
            value={role}
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleSave}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Save changes
        </button>
        {saved && <span className="text-sm text-emerald-600">Saved</span>}
      </div>
    </div>
  );
}