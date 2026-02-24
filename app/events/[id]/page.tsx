import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { events } from "@/lib/mockData";

/**
 * Event detail page — shows full info for one event.
 * Route: /events/[id] (e.g. /events/1). Uses the id to find the event in mockData.
 */
interface EventPageProps {
  params: Promise<{ id: string }>;
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatPrice(price: number) {
  if (price === 0) return "Free";
  return `$${price}`;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const event = events.find((e) => e.id === id);

  if (!event) {
    notFound(); // Renders Next.js 404 page
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        ← Back to events
      </Link>

      <div className="rounded-xl overflow-hidden bg-zinc-800/50 border border-zinc-700/50">
        <div className="relative aspect-[21/9] bg-zinc-800">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 896px) 100vw, 896px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
              {event.title}
            </h1>
            <p className="text-zinc-300 text-sm mt-1">{event.organizer}</p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mb-6">
            <span>{formatDate(event.date)}</span>
            <span>{event.time}</span>
            <span>{event.location}</span>
            <span className="text-amber-400 font-medium">{formatPrice(event.price)}</span>
          </div>

          <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>

          <div className="mt-8 pt-6 border-t border-zinc-700">
            <Link
              href={`/checkout?eventId=${event.id}`}
              className="inline-flex items-center justify-center rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold px-6 py-3 transition-colors"
            >
              Get tickets
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
