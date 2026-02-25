"use client";

import { useState } from "react";

export default function ConnectStripeButton() {
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe-connect/onboarding", {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      alert("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleConnect}
      disabled={loading}
      className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors disabled:opacity-50"
    >
      {loading ? "Redirecting…" : "Connect Stripe"}
    </button>
  );
}
