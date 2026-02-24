import { createServerSupabaseClient } from "@/lib/supabase";
import type { Event } from "@/lib/mockData";

/** DB row shape (snake_case). */
type EventRow = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  image_url: string;
  organizer: string;
  created_by: string | null;
  cancelled_at: string | null;
};

function rowToEvent(row: EventRow): Event {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date,
    time: row.time,
    location: row.location,
    price: Number(row.price),
    imageUrl: row.image_url,
    organizer: row.organizer,
    createdBy: row.created_by ?? null,
    cancelledAt: row.cancelled_at ?? null,
  };
}

/**
 * Fetch all events from Supabase (server-only). Returns [] when Supabase is not configured.
 */
export async function getEvents(): Promise<Event[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("events")
    .select("id, title, description, date, time, location, price, image_url, organizer, created_by, cancelled_at")
    .is("cancelled_at", null)
    .order("date", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToEvent);
}

/**
 * Fetch one event by id (server-only). Returns null if not found or Supabase not configured.
 */
export async function getEventById(id: string): Promise<Event | null> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("events")
    .select("id, title, description, date, time, location, price, image_url, organizer, created_by, cancelled_at")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null; // no rows
    throw error;
  }
  return data ? rowToEvent(data as EventRow) : null;
}

/**
 * Fetch events created by a specific user (server-only). Returns [] when Supabase is not configured.
 */
export async function getEventsByCreator(userId: string): Promise<Event[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("events")
    .select("id, title, description, date, time, location, price, image_url, organizer, created_by, cancelled_at")
    .eq("created_by", userId)
    .order("date", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToEvent);
}
