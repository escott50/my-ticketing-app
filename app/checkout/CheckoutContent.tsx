"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import type { Event } from "@/lib/mockData";

function formatPrice(price: number) {
  if (price === 0) return "Free";
  return `$${price.toFixed(2)}`;
}

/** Bosh fee per ticket: 10% of face + $0.99. Total per ticket = face + fee. */
function feePerTicket(facePrice: number): number {
  return Math.round((facePrice * 0.1 + 0.99) * 100) / 100;
}
function totalPerTicket(facePrice: number): number {
  return Math.round((facePrice + feePerTicket(facePrice)) * 100) / 100;
}

const quantity = 1;

interface CheckoutContentProps {
  event: Event | null;
}

export default function CheckoutContent({ event }: CheckoutContentProps) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    if (!event) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, quantity }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setLoading(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError("No redirect URL");
    } catch {
      setError("Network error");
    }
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-white mb-2">Checkout</h1>
      <p className="text-zinc-400 mb-8">
        Review your order below. Sign in and complete payment with Stripe.
      </p>

      <div className="rounded-xl bg-zinc-800/50 border border-zinc-700/50 overflow-hidden">
        {event ? (
          <>
            <div className="p-6 border-b border-zinc-700">
              <div className="flex gap-4">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-zinc-700 flex-shrink-0">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="font-semibold text-white truncate">{event.title}</h2>
                  <p className="text-sm text-zinc-400">{event.date} · {event.time}</p>
                  <p className="text-sm text-zinc-500 truncate">{event.location}</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Quantity</span>
                <span className="text-white">{quantity}</span>
              </div>
              {event.price > 0 ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Price per ticket (face value)</span>
                    <span className="text-white">{formatPrice(event.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Fee (10% + $0.99 per ticket)</span>
                    <span className="text-white">{formatPrice(feePerTicket(event.price))}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-white pt-3 border-t border-zinc-700">
                    <span>Total</span>
                    <span>{formatPrice(totalPerTicket(event.price) * quantity)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between font-semibold text-white pt-3 border-t border-zinc-700">
                  <span>Total</span>
                  <span>Free</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <p className="text-zinc-400">
              No event selected.{" "}
              <Link href="/" className="text-white hover:text-zinc-300 underline transition-colors">
                Browse events
              </Link>{" "}
              and click &quot;Get tickets&quot; to see an order summary here.
            </p>
          </div>
        )}

        {event && (
          <div className="p-6 pt-0">
            {status === "loading" ? (
              <p className="text-zinc-400 text-sm">Loading…</p>
            ) : !session ? (
              <>
                <p className="text-zinc-400 text-sm mb-4">
                  Sign in to checkout.
                </p>
                <Link
                  href={`/auth/signin?callbackUrl=${encodeURIComponent(`/checkout?eventId=${event.id}`)}`}
                  className="block w-full rounded-full bg-white py-3.5 font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors text-center"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                {error && (
                  <p className="text-red-400 text-sm mb-4">{error}</p>
                )}
                <button
                  type="button"
                  onClick={handlePay}
                  disabled={loading}
                  className="w-full rounded-full bg-white py-3.5 font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  {event.price === 0 ? "Claim free ticket" : "Pay with Stripe"}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">
          ← Back to events
        </Link>
      </div>
    </main>
  );
}
