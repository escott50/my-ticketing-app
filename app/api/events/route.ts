import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase";

/**
 * POST /api/events — create a new event. Requires sign-in; created_by is set to the current user.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    title: string;
    description?: string;
    date: string;
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

  const { title, date } = body;
  if (!title || !date) {
    return NextResponse.json(
      { error: "title and date are required" },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 503 }
    );
  }
  const { data, error } = await supabase
    .from("events")
    .insert({
      title,
      description: body.description ?? "",
      date,
      time: body.time ?? "",
      location: body.location ?? "",
      price: body.price ?? 0,
      image_url: body.imageUrl ?? "",
      organizer: body.organizer ?? "",
      created_by: session.user.id,
    })
    .select("id, title, description, date, time, location, price, image_url, organizer")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      id: data.id,
      title: data.title,
      description: data.description,
      date: data.date,
      time: data.time,
      location: data.location,
      price: Number(data.price),
      imageUrl: data.image_url,
      organizer: data.organizer,
    },
    { status: 201 }
  );
}
