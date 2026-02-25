"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Event } from "@/lib/mockData";

const inputClass =
  "w-full rounded-lg bg-zinc-900 border border-zinc-600 px-3 py-2 text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500";
const labelClass = "block text-sm font-medium text-zinc-300 mb-1";

interface EditEventFormProps {
  event: Event;
}

export default function EditEventForm({ event }: EditEventFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [date, setDate] = useState(event.date);
  const [time, setTime] = useState(event.time);
  const [location, setLocation] = useState(event.location);
  const [price, setPrice] = useState(String(event.price));
  const [imageUrl, setImageUrl] = useState(event.imageUrl);
  const [organizer, setOrganizer] = useState(event.organizer);
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCancelled = !!event.cancelledAt;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: "PATCH",
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
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong.");
        setSaving(false);
        return;
      }
      router.refresh();
      router.push("/organizer");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCancelEvent(cancel: boolean) {
    setError(null);
    setCancelling(true);
    try {
      const res = await fetch(`/api/events/${event.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancel }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong.");
        setCancelling(false);
        return;
      }
      router.refresh();
      if (cancel) router.push("/organizer");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <>
      {isCancelled && (
        <div className="mb-6 rounded-xl border border-amber-900/50 bg-amber-950/30 p-4 text-amber-200 text-sm">
          This event is cancelled. It no longer appears on Explore. You can uncancel it below.
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-6 space-y-5">
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div>
          <label htmlFor="title" className={labelClass}>Event title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputClass}
            placeholder="e.g. Jazz Under the Stars"
          />
        </div>
        <div>
          <label htmlFor="description" className={labelClass}>Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className={inputClass}
            placeholder="What's the event about?"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="date" className={labelClass}>Date</label>
            <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="time" className={labelClass}>Time</label>
            <input id="time" type="text" value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} placeholder="e.g. 7:00 PM" />
          </div>
        </div>
        <div>
          <label htmlFor="location" className={labelClass}>Location</label>
          <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} placeholder="Venue name and address" />
        </div>
        <div>
          <label htmlFor="price" className={labelClass}>Price (0 for free)</label>
          <input id="price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} placeholder="0" />
        </div>
        <div>
          <label htmlFor="imageUrl" className={labelClass}>Image URL</label>
          <input id="imageUrl" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={inputClass} placeholder="https://..." />
        </div>
        <div>
          <label htmlFor="organizer" className={labelClass}>Organizer name</label>
          <input id="organizer" type="text" value={organizer} onChange={(e) => setOrganizer(e.target.value)} className={inputClass} placeholder="Your name or organization" />
        </div>
        <div className="pt-2 flex flex-wrap gap-3">
          <button type="submit" disabled={saving} className="rounded-full bg-white px-8 py-3.5 font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors disabled:opacity-50">
            {saving ? "Saving…" : "Save changes"}
          </button>
          <Link href="/organizer" className="rounded-lg border border-zinc-600 text-zinc-300 hover:bg-zinc-800 px-6 py-3 transition-colors">
            Back to Organizer
          </Link>
          {isCancelled ? (
            <button
              type="button"
              onClick={() => handleCancelEvent(false)}
              disabled={cancelling}
              className="rounded-lg border border-zinc-500 text-zinc-300 hover:bg-zinc-700 px-6 py-3 transition-colors disabled:opacity-50"
            >
              {cancelling ? "…" : "Uncancel event"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleCancelEvent(true)}
              disabled={cancelling}
              className="rounded-lg border border-red-900/50 text-red-300 hover:bg-red-950/30 px-6 py-3 transition-colors disabled:opacity-50"
            >
              {cancelling ? "…" : "Cancel event"}
            </button>
          )}
        </div>
      </form>
    </>
  );
}
