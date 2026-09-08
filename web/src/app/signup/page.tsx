"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || password.length < 6) {
      setError("Please fill out all fields (password must be 6+ characters)");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signup(name.trim(), email.trim(), password);
      router.replace("/projects");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-lg py-xl">
      <div className="w-full max-w-sm">
        <h1 className="mb-xl text-center text-h1 text-primary-dark">Create Account</h1>
        <form onSubmit={handleSubmit}>
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
          {error ? <p className="mb-sm text-caption text-danger">{error}</p> : null}
          <Button type="submit" loading={loading} fullWidth className="mt-sm">
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}
