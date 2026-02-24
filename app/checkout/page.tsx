import { getEventById } from "@/lib/events";
import CheckoutContent from "./CheckoutContent";

/**
 * Checkout page — event is fetched on the server from Supabase and passed to the client.
 */
interface CheckoutPageProps {
  searchParams: Promise<{ eventId?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const eventId = params.eventId ?? null;
  const event = eventId ? await getEventById(eventId) : null;

  return <CheckoutContent event={event} />;
}
