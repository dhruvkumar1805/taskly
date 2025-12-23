"use client";

import { useState } from "react";

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

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      return;
    }
    window.location.href = "/login";
  }

  return (
    <form action={handleSubmit} className="p-6 space-y-4 max-w-sm mx-auto">
      <h1 className="text-xl font-semibold">Create account</h1>

      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="border p-2 w-full"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        minLength={6}
        className="border p-2 w-full"
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 w-full disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Sign up"}
      </button>
    </form>
  );
}
