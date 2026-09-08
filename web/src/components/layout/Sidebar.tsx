"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "@/lib/clsx";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { href: "/projects", label: "Projects", icon: "📁" },
  { href: "/issues", label: "Issues", icon: "🐛" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-border bg-surface px-md py-lg">
      <div className="mb-lg flex items-center gap-sm px-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-light text-xl">
          🐛
        </div>
        <div>
          <p className="text-bodyBold text-text">Bug Tracker</p>
          <p className="truncate text-small text-text-muted">{user?.email}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-sm rounded-md px-sm py-sm text-bodyBold transition-colors",
                active ? "bg-primary-light text-primary" : "text-text-muted hover:bg-surfaceLight"
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
