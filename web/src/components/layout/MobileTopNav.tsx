"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Folder, Bug, User } from "lucide-react";
import clsx from "@/lib/clsx";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: LayoutGrid },
  { href: "/projects", label: "Projects", icon: Folder },
  { href: "/issues", label: "Issues", icon: Bug },
  { href: "/profile", label: "Profile", icon: User },
];

export function MobileTopNav() {
  const pathname = usePathname();
  return (
    <div className="flex items-center justify-around border-b border-border bg-surface py-sm md:hidden">
      {NAV_ITEMS.map((item) => {
        const active = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex flex-col items-center gap-0.5 px-md text-small",
              active ? "text-primary" : "text-text-muted"
            )}
          >
            <Icon size={20} strokeWidth={1.75} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}