"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/common/Button";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <div>
      <div className="mt-xl flex flex-col items-center">
        <div className="mb-md flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-white shadow-card">
          {user?.name?.[0]?.toUpperCase() || "?"}
        </div>
        <p className="text-h2 text-text">{user?.name}</p>
        <p className="mt-1 text-body text-text-muted">{user?.email}</p>
      </div>

      <Button variant="danger" fullWidth className="mt-xl" onClick={handleLogout}>
        Log Out
      </Button>
    </div>
  );
}
