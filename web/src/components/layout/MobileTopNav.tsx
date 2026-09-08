"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "@/lib/clsx";

const NAV_ITEMS = [
  { href: "/projects", label: "Projects", icon: "📁" },
  { href: "/issues", label: "Issues", icon: "🐛" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export function MobileTopNav() {
  const pathname = usePathname();
  return (
    <div className="flex items-center justify-around border-b border-border bg-surface py-sm md:hidden">
      {NAV_ITEMS.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex flex-col items-center gap-0.5 px-md text-small",
              active ? "text-primary" : "text-text-muted"
            )}
          >
            <span className="text-lg leading-none">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
