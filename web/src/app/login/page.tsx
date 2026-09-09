"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bug } from "lucide-react";
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
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Branding / image panel — desktop only */}
      <div className="relative hidden w-1/2 lg:block">
        <Image src="/auth-bg.jpg" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/85 via-primary-dark/40 to-primary-dark/10" />
        <div className="absolute inset-x-0 bottom-0 p-xxl text-white">
          <div className="mb-md flex h-12 w-12 items-center justify-center rounded-md bg-white/15">
            <Bug size={24} strokeWidth={1.75} />
          </div>
          <h2 className="text-h1">Track every bug, ship with confidence.</h2>
          <p className="mt-sm max-w-sm text-body text-white/80">
            Report, triage, and resolve issues across your projects — from first report to shipped fix.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center px-lg py-xl lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mx-auto mb-md flex h-16 w-16 items-center justify-center rounded-[20px] bg-primary-light text-primary lg:hidden">
            <Bug size={28} strokeWidth={1.75} />
          </div>
          <h1 className="text-center text-h1 text-primary-dark lg:text-left">Welcome back</h1>
          <p className="mb-xl mt-xs text-center text-body text-text-muted lg:text-left">
            Sign in to continue
          </p>

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
    </div>
  );
}