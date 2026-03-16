"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Waves, Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
});

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: { email: string; password: string }) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Welcome back!");
        window.location.href = "/dashboard";
      } else {
        const err = await res.json();
        toast.error(err.error ?? "Invalid credentials");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[#5A7A99] hover:text-[#1B6CA8] mb-6 transition-colors"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to site
        </Link>
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
            style={{ backgroundColor: "#EAF3FB" }}
          >
            <Waves className="w-7 h-7 text-[#1B6CA8]" />
          </div>
          <h1
            className="text-2xl text-[#1A2E42]"
            style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontWeight: 600,
            }}
          >
            Admin Login
          </h1>
          <p className="text-[#5A7A99] text-sm mt-1">PerfectWave Dashboard</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="admin@perfectwave.gh"
                className="mt-1"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className="pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A7A99] hover:text-[#1B6CA8] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B6CA8] hover:bg-[#0D4F82] text-white gap-2 mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
