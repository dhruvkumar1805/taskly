"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, Loader2 } from "lucide-react";

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

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
            <h1 className="text-2xl font-semibold">Create your account</h1>
            <p className="text-sm text-muted-foreground">
              Start organizing your tasks in seconds.
            </p>
          </div>

          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                name="name"
                placeholder="Your name"
                required
                disabled={loading}
              />
            </div>

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
              <Input
                name="password"
                type="password"
                placeholder="Minimum 6 characters"
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">
              ALREADY HAVE AN ACCOUNT?
            </span>
            <Separator className="flex-1" />
          </div>

          <p className="text-sm text-center text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline">
              Sign in instead
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
