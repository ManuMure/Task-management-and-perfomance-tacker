"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthTextField from "@/components/auth/AuthTextField";
import LoginBrandPanel from "@/components/auth/LoginBrandPanel";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error ?? "Incorrect email or password.");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-white">
      <LoginBrandPanel />

      <div className="flex w-full flex-col justify-center px-6 py-16 sm:px-12 lg:w-1/2 lg:px-24">
        <div className="mx-auto w-full max-w-sm">
          <p className="text-sm font-semibold text-slate-500">
            Business Registration Service
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="mt-2 text-sm text-slate-500">
            Please enter your credentials to access the system.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500">
                EMAIL ADDRESS / USERNAME
              </label>
              <AuthTextField
                icon={<Mail size={16} />}
                type="email"
                required
                autoComplete="email"
                placeholder="admin@brs-systems.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold tracking-wider text-slate-500">
                  PASSWORD
                </label>
                
              </div>
              <AuthTextField
                icon={<Lock size={16} />}
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="mt-1 rounded-lg bg-blue-700 py-3 text-sm font-semibold tracking-wide text-white hover:bg-blue-800"
            >
              SIGN IN
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-blue-600 hover:underline">
              Create one
            </Link>
          </p>

          <hr className="mt-8 border-slate-100" />

          
        </div>
      </div>
    </div>
  );
}