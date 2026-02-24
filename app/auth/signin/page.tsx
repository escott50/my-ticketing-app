"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";

/**
 * Sign in or sign up — one flow for both. New users create an account by signing in with Google.
 */
export default function SignInPage() {
  return (
    <main className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="section-heading text-2xl font-bold tracking-tight text-white">
        Sign in or sign up
      </h1>
      <p className="mt-2 text-zinc-400">
        Use your Google account to get started. You can buy tickets and manage your account from here.
      </p>
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="mt-8 w-full rounded-full bg-white px-6 py-3.5 font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors"
      >
        Continue with Google
      </button>
      <p className="mt-6 text-center text-sm text-zinc-500">
        By continuing, you agree to use Bosh for event tickets. We only use your email and name to manage your account.
      </p>
      <p className="mt-8 text-center">
        <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">
          ← Back to events
        </Link>
      </p>
    </main>
  );
}
