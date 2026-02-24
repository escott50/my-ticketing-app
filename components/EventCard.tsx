"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Event } from "@/lib/mockData";

/**
 * EventCard — reusable card for the event grid.
 * Shows image, title, date, and price. Clicking goes to the event detail page.
 * Falls back to a placeholder if the image fails to load.
 */
interface EventCardProps {
  event: Event;
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatPrice(price: number) {
  if (price === 0) return "Free";
  return `$${price}`;
}

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect fill='%27272727' width='400' height='250'/%3E%3Ctext fill='%23717171' font-family='system-ui' font-size='18' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3EEvent%3C/text%3E%3C/svg%3E";

export default function EventCard({ event }: EventCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/events/${event.id}`}
      className="group block overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-all hover:border-zinc-600 hover:shadow-lg hover:shadow-black/20"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl bg-zinc-800">
        {imgError ? (
          <div
            className="absolute inset-0 bg-zinc-800 bg-cover bg-center"
            style={{ backgroundImage: `url(${PLACEHOLDER_IMAGE})` }}
          />
        ) : (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        )}
        <div className="absolute right-3 top-3 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-zinc-900">
          {formatPrice(event.price)}
        </div>
      </div>
      <div className="p-5">
        <h2 className="font-semibold text-lg text-white group-hover:text-zinc-300 transition-colors line-clamp-2">
          {event.title}
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          {formatDate(event.date)} · {event.time}
        </p>
        <p className="text-sm text-zinc-500 mt-0.5 truncate">{event.location}</p>
      </div>
    </Link>
  );
}
