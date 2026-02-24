"use client";

import Link from "next/link";
import Image from "next/image";
import type { Event } from "@/lib/mockData";

function formatPrice(price: number) {
  if (price === 0) return "Free";
  return `$${price}`;
}

const quantity = 1;

interface CheckoutContentProps {
  event: Event | null;
}

export default function CheckoutContent({ event }: CheckoutContentProps) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-white mb-2">Checkout</h1>
      <p className="text-zinc-400 mb-8">
        Review your order below. (This is a demo — no payment is processed.)
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
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Price per ticket</span>
                <span className="text-white">{formatPrice(event.price)}</span>
              </div>
              <div className="flex justify-between font-semibold text-white pt-3 border-t border-zinc-700">
                <span>Total</span>
                <span>{formatPrice(event.price * quantity)}</span>
              </div>
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
            <button
              type="button"
              className="w-full rounded-full bg-white py-3.5 font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors"
            >
              Confirm (demo only)
            </button>
            <p className="text-center text-xs text-zinc-500 mt-3">
              No payment is processed. This is mock checkout.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link
          href="/"
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          ← Back to events
        </Link>
      </div>
    </main>
  );
}
