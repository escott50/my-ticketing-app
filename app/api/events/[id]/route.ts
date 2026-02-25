import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * PATCH /api/events/[id] — update an event. Only the creator can update.
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: eventId } = await params;
  if (!eventId) {
    return NextResponse.json({ error: "Event ID required" }, { status: 400 });
  }

  let body: {
    title?: string;
    description?: string;
    date?: string;
    time?: string;
    location?: string;
    price?: number;
    imageUrl?: string;
    organizer?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 503 }
    );
  }

  const { data: existing, error: fetchError } = await supabase
    .from("events")
    .select("created_by")
    .eq("id", eventId)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }
  if (existing.created_by !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updates: Record<string, unknown> = {};
  if (body.title !== undefined) updates.title = body.title;
  if (body.description !== undefined) updates.description = body.description;
  if (body.date !== undefined) updates.date = body.date;
  if (body.time !== undefined) updates.time = body.time;
  if (body.location !== undefined) updates.location = body.location;
  if (body.price !== undefined) updates.price = body.price;
  if (body.imageUrl !== undefined) updates.image_url = body.imageUrl;
  if (body.organizer !== undefined) updates.organizer = body.organizer;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("events")
    .update(updates)
    .eq("id", eventId)
    .select("id, title, description, date, time, location, price, image_url, organizer")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    id: data.id,
    title: data.title,
    description: data.description,
    date: data.date,
    time: data.time,
    location: data.location,
    price: Number(data.price),
    imageUrl: data.image_url,
    organizer: data.organizer,
  });
}
