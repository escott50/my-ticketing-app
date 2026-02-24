"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Create event page — form for organizers to add a new event.
 * Doesn't save anywhere yet; we're just building the UI and local state.
 */
export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    // In a real app we'd call an API or database here.
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        ← Back to events
      </Link>

      <h1 className="text-2xl font-bold text-white mb-2">Create an event</h1>
      <p className="text-zinc-400 mb-8">
        Fill in the details below. (Nothing is saved yet — this is mock-only.)
      </p>

      {submitted ? (
        <div className="rounded-xl bg-zinc-800/50 border border-zinc-700 p-6 text-center">
          <p className="font-medium text-white">Form submitted!</p>
          <p className="text-zinc-400 text-sm mt-1">
            In a real app we would save this to a database.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-4 text-sm text-zinc-400 hover:text-white underline"
          >
            Submit another
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-zinc-800/50 border border-zinc-700/50 p-6 space-y-5"
        >
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-1">
              Event title
            </label>
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
            <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1">
              Description
            </label>
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
              <label htmlFor="date" className="block text-sm font-medium text-zinc-300 mb-1">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg bg-zinc-900 border border-zinc-600 px-3 py-2 text-white focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-zinc-300 mb-1">
                Time
              </label>
              <input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-lg bg-zinc-900 border border-zinc-600 px-3 py-2 text-white focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-zinc-300 mb-1">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-600 px-3 py-2 text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="Venue name and address"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-zinc-300 mb-1">
              Price (0 for free)
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-600 px-3 py-2 text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-zinc-300 mb-1">
              Image URL
            </label>
            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-600 px-3 py-2 text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label htmlFor="organizer" className="block text-sm font-medium text-zinc-300 mb-1">
              Organizer name
            </label>
            <input
              id="organizer"
              type="text"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-600 px-3 py-2 text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="Your name or organization"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="rounded-full bg-white px-8 py-3.5 font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors"
            >
              Create event
            </button>
            <Link
              href="/"
              className="rounded-lg border border-zinc-600 text-zinc-300 hover:bg-zinc-800 px-6 py-3 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </main>
  );
}
