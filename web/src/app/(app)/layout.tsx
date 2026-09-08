"use client";

import { RequireAuth } from "@/components/layout/RequireAuth";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileTopNav } from "@/components/layout/MobileTopNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="flex min-h-screen bg-background">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex min-h-screen flex-1 flex-col">
          <MobileTopNav />
          <main className="mx-auto w-full max-w-3xl flex-1 px-md py-lg md:px-xl">{children}</main>
        </div>
      </div>
    </RequireAuth>
  );
}
