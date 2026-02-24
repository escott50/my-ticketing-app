"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

/**
 * Account page — profile for the signed-in user. Placeholder for tickets/orders later.
 */
export default function AccountPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-8 sm:py-16">
        <p className="text-zinc-400">Loading...</p>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-8 sm:py-16">
        <h1 className="section-heading text-2xl font-bold tracking-tight text-white">
          Account
        </h1>
        <p className="mt-4 text-zinc-400">
          You need to sign in to view your account.
        </p>
        <Link
          href="/auth/signin"
          className="mt-6 inline-block rounded-full bg-white px-6 py-3.5 font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors"
        >
          Sign in or sign up
        </Link>
      </main>
    );
  }

  const { user } = session;

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-8 sm:py-16">
      <h1 className="section-heading text-2xl font-bold tracking-tight text-white">
        Account
      </h1>
      <p className="mt-2 text-zinc-400">
        Your profile and account settings.
      </p>

      <div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <div className="flex items-center gap-5">
          {user.image ? (
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-zinc-800">
              <Image
                src={user.image}
                alt={user.name ?? "Profile"}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-zinc-700 text-xl font-semibold text-zinc-300">
              {(user.name ?? user.email ?? "?")[0].toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            {user.name && (
              <p className="font-medium text-white">{user.name}</p>
            )}
            {user.email && (
              <p className="text-sm text-zinc-400 truncate">{user.email}</p>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-400">Your tickets</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Tickets you’ve purchased will appear here once payments are set up.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </main>
  );
}
