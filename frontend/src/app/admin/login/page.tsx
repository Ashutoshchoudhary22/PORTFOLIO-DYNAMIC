"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLoginLogo } from "@/components/admin/admin-login-logo";
import { LoginBackground } from "@/components/admin/login-background";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi, publicApi } from "@/lib/api";
import { setAdminToken } from "@/lib/admin-auth";
import { queryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";

const REMEMBER_KEY = "admin-login-email";

type LoginView = "setup" | "login" | "otp" | "forgot-email" | "forgot-reset";

const inputClassName =
  "w-full rounded-md border border-white/20 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]";

export default function AdminLoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [view, setView] = useState<LoginView>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: profile } = useQuery({
    queryKey: queryKeys.profile,
    queryFn: publicApi.getProfile,
    staleTime: 5 * 60 * 1000,
  });

  const { data: setupStatus, isLoading: setupStatusLoading } = useQuery({
    queryKey: ["admin-setup-status"],
    queryFn: adminApi.getSetupStatus,
    staleTime: 0,
  });

  useEffect(() => {
    if (setupStatus?.needsSetup) {
      setView("setup");
    }
  }, [setupStatus?.needsSetup]);

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

  function resetAlerts() {
    setError(null);
    setMessage(null);
  }

  async function handleSetup(event: React.FormEvent) {
    event.preventDefault();
    resetAlerts();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await adminApi.setupAdmin({
        name,
        email,
        password,
        confirmPassword,
      });
      await queryClient.invalidateQueries({ queryKey: ["admin-setup-status"] });
      setMessage("Admin account created. Log in with your email and password.");
      setPassword("");
      setConfirmPassword("");
      setView("login");
    } catch (setupError) {
      setError(setupError instanceof Error ? setupError.message : "Failed to create admin account");
    } finally {
      setLoading(false);
    }
  }

  async function handleLoginRequest(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    resetAlerts();

    try {
      const result = await adminApi.requestLoginOtp(email, password);

      try {
        if (rememberMe) {
          localStorage.setItem(REMEMBER_KEY, email);
        } else {
          localStorage.removeItem(REMEMBER_KEY);
        }
      } catch {
        // ignore storage errors
      }

      setMessage(`OTP sent to ${result.email}. It expires in ${result.expiresInMinutes} minutes.`);
      setOtp("");
      setView("otp");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    resetAlerts();

    try {
      const result = await adminApi.verifyLoginOtp(email, otp);
      setAdminToken(result.token);
      router.replace("/admin/dashboard");
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotRequest(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    resetAlerts();

    try {
      await adminApi.requestForgotPasswordOtp(email);
      setMessage("If this admin account exists, an OTP has been sent to the registered email.");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setView("forgot-reset");
    } catch (forgotError) {
      setError(forgotError instanceof Error ? forgotError.message : "Failed to send reset OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(event: React.FormEvent) {
    event.preventDefault();
    resetAlerts();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await adminApi.resetPasswordWithOtp(email, otp, newPassword);
      setMessage("Password updated successfully. Log in with your new password.");
      setPassword("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setView("login");
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="fixed inset-0 -z-10 bg-[#1a1520]">
        <LoginBackground sectionVideos={profile?.sectionVideos} />
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
              {view === "setup" && "Create Admin Account"}
              {view === "login" && "Login to your Account"}
              {view === "otp" && "Verify OTP"}
              {view === "forgot-email" && "Forgot Password"}
              {view === "forgot-reset" && "Set New Password"}
            </h1>
            {view === "setup" && (
              <p className="mt-2 text-sm text-white/75">
                No admin found. Set up your first admin account to continue.
              </p>
            )}
            {view === "otp" && (
              <p className="mt-2 text-sm text-white/75">
                Enter the 6-digit code sent to your admin email.
              </p>
            )}
          </div>

          {setupStatusLoading && view !== "setup" && (
            <p className="text-center text-sm text-white/70">Checking setup status...</p>
          )}

          {view === "setup" && (
            <form onSubmit={handleSetup} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="setup-name" className="text-sm font-medium text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                  Full Name
                </label>
                <input
                  id="setup-name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={inputClassName}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="setup-email" className="text-sm font-medium text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                  Email
                </label>
                <input
                  id="setup-email"
                  type="email"
                  placeholder="mail@abc.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClassName}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="setup-password" className="text-sm font-medium text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                  Password
                </label>
                <input
                  id="setup-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className={inputClassName}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="setup-confirm-password" className="text-sm font-medium text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                  Confirm Password
                </label>
                <input
                  id="setup-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className={inputClassName}
                />
              </div>

              {error && (
                <p className="text-sm text-red-100 bg-red-500/15 border border-red-300/20 rounded-lg px-3 py-2 drop-shadow-sm">
                  {error}
                </p>
              )}
              {message && (
                <p className="text-sm text-emerald-100 bg-emerald-500/15 border border-emerald-300/20 rounded-lg px-3 py-2 drop-shadow-sm">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#6b214c] hover:bg-[#5a1b3f] text-white font-semibold py-3.5 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-[#6b214c]/20"
              >
                {loading ? "Creating account..." : "Create Admin Account"}
              </button>
            </form>
          )}

          {view === "login" && (
            <form onSubmit={handleLoginRequest} className="space-y-5">
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
                  className={inputClassName}
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
                  className={inputClassName}
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
                  onClick={() => {
                    resetAlerts();
                    setView("forgot-email");
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              {error && (
                <p className="text-sm text-red-100 bg-red-500/15 border border-red-300/20 rounded-lg px-3 py-2 drop-shadow-sm">
                  {error}
                </p>
              )}
              {message && (
                <p className="text-sm text-emerald-100 bg-emerald-500/15 border border-emerald-300/20 rounded-lg px-3 py-2 drop-shadow-sm">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#6b214c] hover:bg-[#5a1b3f] text-white font-semibold py-3.5 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-[#6b214c]/20"
              >
                {loading ? "Sending OTP..." : "Continue"}
              </button>
            </form>
          )}

          {view === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                  OTP Code
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  className={cn(inputClassName, "tracking-[0.35em] text-center text-lg font-semibold")}
                />
              </div>

              {error && (
                <p className="text-sm text-red-100 bg-red-500/15 border border-red-300/20 rounded-lg px-3 py-2 drop-shadow-sm">
                  {error}
                </p>
              )}
              {message && (
                <p className="text-sm text-emerald-100 bg-emerald-500/15 border border-emerald-300/20 rounded-lg px-3 py-2 drop-shadow-sm">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full rounded-md bg-[#6b214c] hover:bg-[#5a1b3f] text-white font-semibold py-3.5 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-[#6b214c]/20"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>

              <button
                type="button"
                className="w-full text-sm text-white/85 hover:text-white transition-colors"
                onClick={() => {
                  resetAlerts();
                  setView("login");
                }}
              >
                Back to login
              </button>
            </form>
          )}

          {view === "forgot-email" && (
            <form onSubmit={handleForgotRequest} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="forgot-email" className="text-sm font-medium text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                  Admin Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="mail@abc.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClassName}
                />
              </div>

              {error && (
                <p className="text-sm text-red-100 bg-red-500/15 border border-red-300/20 rounded-lg px-3 py-2 drop-shadow-sm">
                  {error}
                </p>
              )}
              {message && (
                <p className="text-sm text-emerald-100 bg-emerald-500/15 border border-emerald-300/20 rounded-lg px-3 py-2 drop-shadow-sm">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#6b214c] hover:bg-[#5a1b3f] text-white font-semibold py-3.5 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-[#6b214c]/20"
              >
                {loading ? "Sending OTP..." : "Send Reset OTP"}
              </button>

              <button
                type="button"
                className="w-full text-sm text-white/85 hover:text-white transition-colors"
                onClick={() => {
                  resetAlerts();
                  setView("login");
                }}
              >
                Back to login
              </button>
            </form>
          )}

          {view === "forgot-reset" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="reset-otp" className="text-sm font-medium text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                  OTP Code
                </label>
                <input
                  id="reset-otp"
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  className={cn(inputClassName, "tracking-[0.35em] text-center text-lg font-semibold")}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="new-password" className="text-sm font-medium text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className={inputClassName}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-medium text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className={inputClassName}
                />
              </div>

              {error && (
                <p className="text-sm text-red-100 bg-red-500/15 border border-red-300/20 rounded-lg px-3 py-2 drop-shadow-sm">
                  {error}
                </p>
              )}
              {message && (
                <p className="text-sm text-emerald-100 bg-emerald-500/15 border border-emerald-300/20 rounded-lg px-3 py-2 drop-shadow-sm">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full rounded-md bg-[#6b214c] hover:bg-[#5a1b3f] text-white font-semibold py-3.5 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-[#6b214c]/20"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>

              <button
                type="button"
                className="w-full text-sm text-white/85 hover:text-white transition-colors"
                onClick={() => {
                  resetAlerts();
                  setView("forgot-email");
                }}
              >
                Resend OTP
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
