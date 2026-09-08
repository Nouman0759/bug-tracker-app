"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please enter your email and password");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace("/projects");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-lg">
      <div className="w-full max-w-sm">
        <div className="mx-auto mb-md flex h-16 w-16 items-center justify-center rounded-[20px] bg-primary-light text-3xl">
          🐛
        </div>
        <h1 className="text-center text-h1 text-primary-dark">Bug Tracker</h1>
        <p className="mb-xl mt-xs text-center text-body text-text-muted">Sign in to continue</p>

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          {error ? <p className="mb-sm text-caption text-danger">{error}</p> : null}
          <Button type="submit" loading={loading} fullWidth className="mt-sm">
            Log In
          </Button>
        </form>
        <Link href="/signup" className="mt-md block">
          <Button variant="ghost" fullWidth type="button">
            Create an account
          </Button>
        </Link>
      </div>
    </div>
  );
}
