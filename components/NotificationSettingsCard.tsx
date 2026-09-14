"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import Toggle from "./Toggle";

interface NotificationSetting {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
}

const initialSettings: NotificationSetting[] = [
  {
    key: "sla-breach",
    label: "SLA breach alerts",
    description: "Get notified immediately when a task is at risk of breaching SLA.",
    enabled: true,
  },
  {
    key: "task-assigned",
    label: "Task assignments",
    description: "Get notified when a new task is assigned to you.",
    enabled: true,
  },
  {
    key: "weekly-summary",
    label: "Weekly summary",
    description: "A digest of your completed tasks and on-time rate, every Monday.",
    enabled: false,
  },
  {
    key: "registration-updates",
    label: "Registration status updates",
    description: "Get notified when a registration you filed changes status.",
    enabled: true,
  },
];

export default function NotificationSettingsCard() {
  const [settings, setSettings] = useState(initialSettings);

  const toggle = (key: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <Bell size={18} className="text-blue-600" />
        <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
      </div>

      <div className="flex flex-col divide-y divide-slate-100">
        {settings.map(({ key, label, description, enabled }) => (
          <div key={key} className="flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0">
            <div>
              <p className="text-sm font-medium text-slate-800">{label}</p>
              <p className="mt-0.5 text-sm text-slate-500">{description}</p>
            </div>
            <Toggle checked={enabled} onChange={() => toggle(key)} label={label} />
          </div>
        ))}
      </div>
    </div>
  );
}