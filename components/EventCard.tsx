"use client";

import Link from "next/link";
import Image from "next/image";
import type { Event } from "@/lib/mockData";

/**
 * EventCard — reusable card for the event grid.
 * Shows image, title, date, and price. Clicking goes to the event detail page.
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

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group block rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all hover:shadow-lg hover:shadow-black/20"
    >
      <div className="relative aspect-[16/10] bg-zinc-800 overflow-hidden rounded-t-xl">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-white text-sm font-medium text-zinc-900">
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
