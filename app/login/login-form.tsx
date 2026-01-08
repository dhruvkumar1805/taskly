"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, ArrowRight, Check, Loader2, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(formData: FormData) {
    setLoading(true);

    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      callbackUrl: "/dashboard",
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm rounded-2xl shadow-xl">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              <Check />
            </div>
            <span className="font-semibold text-lg">Taskly</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Please enter your details to sign in.
            </p>
          </div>

          <form action={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground">
            Don’t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Create account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
