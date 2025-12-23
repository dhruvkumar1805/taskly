"use client";

import { signIn } from "next-auth/react";

export default function LoginForm() {
  async function handleLogin(formData: FormData) {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      callbackUrl: "/dashboard",
    });
  }

  return (
    <form action={handleLogin} className="p-6 space-y-4 max-w-sm">
      <h1 className="text-xl font-semibold">Sign in</h1>

      <input name="email" type="email" className="border p-2 w-full" />
      <input name="password" type="password" className="border p-2 w-full" />

      <button className="bg-black text-white px-4 py-2">Sign in</button>
    </form>
  );
}
