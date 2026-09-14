"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { isValidEmail, validatePassword } from "@/lib/validation";
import AuthTextField from "@/components/auth/AuthTextField";
import RegisterBrandPanel from "@/components/auth/RegisterBrandPanel";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      setError(passwordCheck.message ?? "Password does not meet the requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    const result = await register(name, email, password);
    if (!result.success) {
      setError(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex w-full flex-col justify-center px-6 py-16 sm:px-12 lg:w-1/2 lg:px-24">
        <div className="mx-auto w-full max-w-sm">
          <p className="text-sm font-semibold text-slate-500">
            Business Registration Service
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Create an Account</h1>
          <p className="mt-2 text-sm text-slate-500">
            Set up access to the administrative management hub.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500">
                FULL NAME
              </label>
              <AuthTextField
                icon={<User size={16} />}
                type="text"
                required
                autoComplete="name"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500">
                EMAIL ADDRESS
              </label>
              <AuthTextField
                icon={<Mail size={16} />}
                type="email"
                required
                autoComplete="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500">
                PASSWORD
              </label>
              <AuthTextField
                icon={<Lock size={16} />}
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="At least 8 characters"
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
              <p className="mt-1.5 text-xs text-slate-400">
                At least 8 characters, with uppercase, lowercase, a number, and a special
                character.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500">
                CONFIRM PASSWORD
              </label>
              <AuthTextField
                icon={<Lock size={16} />}
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="mt-1 rounded-lg bg-blue-700 py-3 text-sm font-semibold tracking-wide text-white hover:bg-blue-800"
            >
              CREATE ACCOUNT
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <RegisterBrandPanel />
    </div>
  );
}