"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

/**
 * Header — minimal sticky nav. Logo left, links right. Sign in / user + sign out.
 */
export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const navLinks = [
    { href: "/", label: "Events" },
    { href: "/events/create", label: "Create Event" },
    { href: "/checkout", label: "Checkout" },
  ];
  // When logged in, show Account instead of only email + sign out
  const authLinks = session?.user
    ? [{ href: "/account", label: "Account" }]
    : [];

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
        <Link
          href="/"
          className="text-lg font-semibold text-white hover:text-zinc-300 transition-colors"
        >
          Bosh
        </Link>
        <nav className="flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative text-sm transition-colors ${
                isActive(href)
                  ? "text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {label}
              {isActive(href) && (
                <span className="absolute -bottom-px left-0 right-0 h-px bg-white" />
              )}
            </Link>
          ))}
          {authLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative text-sm transition-colors ${
                isActive(href)
                  ? "text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {label}
              {isActive(href) && (
                <span className="absolute -bottom-px left-0 right-0 h-px bg-white" />
              )}
            </Link>
          ))}
          {status === "loading" ? (
            <span className="text-sm text-zinc-500">...</span>
          ) : session?.user ? (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/auth/signin"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
