import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * POST /api/events/[id]/cancel — set cancelled_at (soft cancel). Only the creator can cancel.
 * Body: { cancel: boolean } — true to cancel, false to uncancel.
 */
export async function POST(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: eventId } = await params;
  if (!eventId) {
    return NextResponse.json({ error: "Event ID required" }, { status: 400 });
  }

  let body: { cancel?: boolean };
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const cancel = body.cancel !== false;

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

  const { error } = await supabase
    .from("events")
    .update({ cancelled_at: cancel ? new Date().toISOString() : null })
    .eq("id", eventId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    cancelled: cancel,
  });
}
