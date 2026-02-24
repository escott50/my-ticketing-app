import EventCard from "@/components/EventCard";
import { getEvents } from "@/lib/events";

/**
 * Explore — discover events from Supabase in a responsive grid.
 */
export default async function HomePage() {
  const events = await getEvents();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
      <header className="mb-12 sm:mb-16">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Explore
        </h1>
        <p className="mt-3 text-zinc-400 sm:text-lg">
          Discover events and get tickets. Free and paid.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {events.length === 0 ? (
          <p className="col-span-full text-zinc-500">No events yet. Create one to get started.</p>
        ) : (
          events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        )}
      </div>
    </main>
  );
}
