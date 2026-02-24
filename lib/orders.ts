import { createServerSupabaseClient } from "@/lib/supabase";

export type OrderWithAttendee = {
  id: string;
  eventId: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  attendeeName: string | null;
  attendeeEmail: string | null;
};

type OrderRow = {
  id: string;
  event_id: string;
  user_id: string;
  quantity: number;
  total_price: number;
  created_at: string;
};

type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
};

/**
 * Fetch orders for the given event IDs and attach attendee name/email from next_auth.users.
 * Server-only. Returns [] when Supabase is not configured.
 */
export async function getOrdersForEvents(
  eventIds: string[]
): Promise<OrderWithAttendee[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase || eventIds.length === 0) return [];

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id, event_id, user_id, quantity, total_price, created_at")
    .in("event_id", eventIds)
    .order("created_at", { ascending: false });

  if (ordersError) throw ordersError;
  if (!orders?.length) return [];

  const userIds = [...new Set((orders as OrderRow[]).map((o) => o.user_id))];

  const { data: users, error: usersError } = await supabase
    .schema("next_auth")
    .from("users")
    .select("id, name, email")
    .in("id", userIds);

  if (usersError) throw usersError;
  const userMap = new Map<string, UserRow>();
  (users ?? []).forEach((u) => userMap.set(u.id, u as UserRow));

  return (orders as OrderRow[]).map((o) => {
    const user = userMap.get(o.user_id);
    return {
      id: o.id,
      eventId: o.event_id,
      quantity: o.quantity,
      totalPrice: Number(o.total_price),
      createdAt: o.created_at,
      attendeeName: user?.name ?? null,
      attendeeEmail: user?.email ?? null,
    };
  });
}
