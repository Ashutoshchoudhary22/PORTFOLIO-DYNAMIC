"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLoginLogo } from "@/components/admin/admin-login-logo";
import { LoginBackground } from "@/components/admin/login-background";
import { Checkbox } from "@/components/ui/checkbox";
import { adminApi, publicApi } from "@/lib/api";
import { setAdminToken } from "@/lib/admin-auth";
import type { SectionVideo } from "@/lib/types";
import { cn } from "@/lib/utils";

const REMEMBER_KEY = "admin-login-email";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sectionVideos, setSectionVideos] = useState<SectionVideo[]>();

  useEffect(() => {
    publicApi
      .getProfile()
      .then((profile) => setSectionVideos(profile.sectionVideos))
      .catch(() => setSectionVideos(undefined));
  }, []);

  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem(REMEMBER_KEY);
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await adminApi.login(email, password);
      setAdminToken(result.token);

      try {
        if (rememberMe) {
          localStorage.setItem(REMEMBER_KEY, email);
        } else {
          localStorage.removeItem(REMEMBER_KEY);
        }
      } catch {
        // ignore storage errors
      }

      router.replace("/admin/dashboard");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="fixed inset-0 -z-10 bg-[#1a1520]">
        <LoginBackground sectionVideos={sectionVideos} />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <div
        className={cn(
          "w-full max-w-[420px] rounded-[28px] border border-white/15 bg-transparent overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.2)]",
          "flex items-center justify-center px-6 py-10 sm:px-10 sm:py-12"
        )}
      >
          <div className="w-full">
            <div className="flex justify-center mb-6">
              <AdminLoginLogo className="h-12 w-12 text-white drop-shadow-md" />
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-[1.65rem] font-bold text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                Login to your Account
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="mail@abc.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    className="border-white/40 data-[state=checked]:bg-[#6b214c] data-[state=checked]:border-[#6b214c]"
                  />
                  <span className="text-sm text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">Remember Me</span>
                </label>
                <button
                  type="button"
                  className="text-sm font-medium text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] hover:text-white/90 transition-colors"
                  onClick={() => setError("Please contact the site administrator to reset your password.")}
                >
                  Forgot Password?
                </button>
              </div>

              {error && (
                <p className="text-sm text-red-100 bg-red-500/15 border border-red-300/20 rounded-lg px-3 py-2 drop-shadow-sm">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#6b214c] hover:bg-[#5a1b3f] text-white font-semibold py-3.5 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-[#6b214c]/20"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
              Not Registered Yet?{" "}
              <button
                type="button"
                className="font-semibold text-white hover:text-white/80 transition-colors"
                onClick={() => setError("Admin accounts are created by the site owner only.")}
              >
                Create an account
              </button>
            </p>
          </div>
      </div>
    </div>
  );
}
