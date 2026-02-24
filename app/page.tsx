import EventCard from "@/components/EventCard";
import { events } from "@/lib/mockData";

/**
 * Homepage — lists all events in a responsive grid of EventCard components.
 * Data comes from lib/mockData (no database yet).
 */
export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-white mb-2">Upcoming Events</h1>
      <p className="text-zinc-400 mb-8">
        Find and book tickets for events near you.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </main>
  );
}
