"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

/**
 * Create event page — form posts to /api/events and inserts into Supabase. Requires sign-in.
 */
export default function CreateEventPage() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          date,
          time,
          location,
          price: price === "" ? 0 : Number(price),
          imageUrl,
          organizer,
        }),
      });
      if (res.status === 401) {
        setError("Please sign in to create an event.");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <p className="text-zinc-400">Loading...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <Link href="/" className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6 transition-colors">
          ← Back to events
        </Link>
        <h1 className="text-2xl font-bold text-white mb-2">Create an event</h1>
        <p className="text-zinc-400 mb-6">
          You need to sign in to create an event.
        </p>
        <Link
          href="/auth/signin?callbackUrl=/events/create"
          className="inline-block rounded-full bg-white px-6 py-3.5 font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors"
        >
          Sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link href="/" className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6 transition-colors">
        ← Back to events
      </Link>

      <h1 className="text-2xl font-bold text-white mb-2">Create an event</h1>
      <p className="text-zinc-400 mb-8">
        Fill in the details below. The event will be saved to the database.
      </p>

      {submitted ? (
        <div className="rounded-xl bg-zinc-800/50 border border-zinc-700 p-6 text-center">
          <p className="font-medium text-white">Event created!</p>
          <p className="text-zinc-400 text-sm mt-1">
            It’s now listed on the homepage.
          </p>
          <Link href="/" className="mt-4 inline-block text-sm text-white hover:text-zinc-300 underline">
            View all events
          </Link>
          <button
            type="button"
            onClick={() => { setSubmitted(false); setTitle(""); setDescription(""); setDate(""); setTime(""); setLocation(""); setPrice(""); setImageUrl(""); setOrganizer(""); }}
            className="block mt-2 mx-auto text-sm text-zinc-400 hover:text-white underline"
          >
            Create another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-xl bg-zinc-800/50 border border-zinc-700/50 p-6 space-y-5">
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-1">Event title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg bg-zinc-900 border border-zinc-600 px-3 py-2 text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="e.g. Jazz Under the Stars"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-600 px-3 py-2 text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="What's the event about?"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-zinc-300 mb-1">Date</label>
              <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full rounded-lg bg-zinc-900 border border-zinc-600 px-3 py-2 text-white focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500" />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-zinc-300 mb-1">Time</label>
              <input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-lg bg-zinc-900 border border-zinc-600 px-3 py-2 text-white focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500" />
            </div>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-zinc-300 mb-1">Location</label>
            <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-lg bg-zinc-900 border border-zinc-600 px-3 py-2 text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500" placeholder="Venue name and address" />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-zinc-300 mb-1">Price (0 for free)</label>
            <input id="price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-lg bg-zinc-900 border border-zinc-600 px-3 py-2 text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500" placeholder="0" />
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-zinc-300 mb-1">Image URL</label>
            <input id="imageUrl" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full rounded-lg bg-zinc-900 border border-zinc-600 px-3 py-2 text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500" placeholder="https://..." />
          </div>
          <div>
            <label htmlFor="organizer" className="block text-sm font-medium text-zinc-300 mb-1">Organizer name</label>
            <input id="organizer" type="text" value={organizer} onChange={(e) => setOrganizer(e.target.value)} className="w-full rounded-lg bg-zinc-900 border border-zinc-600 px-3 py-2 text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500" placeholder="Your name or organization" />
          </div>
          <div className="pt-2 flex gap-3">
            <button type="submit" disabled={loading} className="rounded-full bg-white px-8 py-3.5 font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors disabled:opacity-50">
              {loading ? "Creating…" : "Create event"}
            </button>
            <Link href="/" className="rounded-lg border border-zinc-600 text-zinc-300 hover:bg-zinc-800 px-6 py-3 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      )}
    </main>
  );
}
