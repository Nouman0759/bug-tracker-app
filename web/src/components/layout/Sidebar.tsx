"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, Folder, Bug, Plus, LogOut } from "lucide-react";
import clsx from "@/lib/clsx";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/projects", label: "Projects", icon: Folder },
  { href: "/issues", label: "Issues", icon: Bug },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col overflow-y-auto border-r border-border bg-surface px-md py-lg">
      <div className="mb-lg flex items-center gap-sm px-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-light text-primary">
          <Bug size={20} strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <p className="text-bodyBold text-text">Bug Tracker</p>
          <p className="truncate text-small text-text-muted">{user?.email}</p>
        </div>
      </div>

      <Link
        href="/issues/new"
        className="mb-lg flex items-center justify-center gap-sm rounded-md bg-primary px-md py-sm text-bodyBold text-white shadow-subtle transition-colors hover:bg-primary-dark"
      >
        <Plus size={18} strokeWidth={2} />
        Report Issue
      </Link>

      <p className="mb-xs px-sm text-small uppercase tracking-wide text-text-muted">
        Workspace
      </p>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-sm rounded-md border-l-[3px] px-sm py-sm text-bodyBold transition-colors",
                active
                  ? "border-primary bg-primary-light text-primary"
                  : "border-transparent text-text-muted hover:bg-surfaceLight"
              )}
            >
              <Icon size={18} strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-sm rounded-md px-sm py-sm text-bodyBold text-text-muted transition-colors hover:bg-surfaceLight hover:text-danger"
      >
        <LogOut size={18} strokeWidth={1.75} />
        Log Out
      </button>
    </aside>
  );
}