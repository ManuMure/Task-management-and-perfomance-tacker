"use client";

import { InputHTMLAttributes, ReactNode } from "react";

interface AuthTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode;
  trailing?: ReactNode;
}

export default function AuthTextField({ icon, trailing, className, ...props }: AuthTextFieldProps) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </span>
      <input
        {...props}
        className={`w-full rounded-lg border border-slate-300 py-2.5 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
          trailing ? "pr-10" : "pr-3"
        } ${className ?? ""}`}
      />
      {trailing && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">{trailing}</span>
      )}
    </div>
  );
}