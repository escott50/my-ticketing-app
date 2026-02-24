import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getEventsByCreator } from "@/lib/events";
import { getOrdersForEvents, type OrderWithAttendee } from "@/lib/orders";
import { getOrganizerStripeAccountId } from "@/lib/stripe-connect";
import type { Event } from "@/lib/mockData";
import ConnectStripeButton from "./ConnectStripeButton";

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatOrderDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatPrice(price: number) {
  if (price === 0) return "Free";
  return `$${price.toFixed(2)}`;
}

function isUpcoming(dateStr: string) {
  return new Date(dateStr + "T00:00:00") >= new Date();
}

interface OrganizerPageProps {
  searchParams: Promise<{ stripe?: string }>;
}

export default async function OrganizerPage({ searchParams }: OrganizerPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/organizer");
  }

  const params = await searchParams;
  const stripeComplete = params.stripe === "complete";
  const stripeConnected = (await getOrganizerStripeAccountId(session.user.id)) !== null;

  const events = await getEventsByCreator(session.user.id);
  const eventIds = events.map((e) => e.id);
  const allOrders = await getOrdersForEvents(eventIds);
  const ordersByEventId = allOrders.reduce<Record<string, OrderWithAttendee[]>>(
    (acc, order) => {
      if (!acc[order.eventId]) acc[order.eventId] = [];
      acc[order.eventId].push(order);
      return acc;
    },
    {}
  );

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-8 sm:py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Organizer
        </h1>
        <p className="mt-2 text-zinc-400">
          Manage the events you’ve created and see who’s registered.
        </p>
      </header>

      {stripeComplete && (
        <div className="mb-6 rounded-xl border border-emerald-900/50 bg-emerald-950/30 p-4 text-emerald-200 text-sm">
          Stripe connected. You can now accept payments for paid events; funds go to your Stripe account and Bosh takes a 10% + $0.99/ticket fee.
        </div>
      )}

      <section className="mb-10 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500 mb-2">Payments</h2>
        {stripeConnected ? (
          <p className="text-zinc-300 text-sm">Stripe connected. Payouts go to your connected account.</p>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-zinc-400 text-sm">Connect Stripe to accept payments for paid events.</p>
            <ConnectStripeButton />
          </div>
        )}
      </section>

      {events.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 sm:p-12 text-center">
          <p className="text-zinc-400">You haven’t created any events yet.</p>
          <Link
            href="/events/create"
            className="mt-6 inline-block rounded-full bg-white px-6 py-3 font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors"
          >
            Create your first event
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <OrganizerEventCard
              key={event.id}
              event={event}
              orders={ordersByEventId[event.id] ?? []}
            />
          ))}
        </ul>
      )}
    </main>
  );
}

function OrganizerEventCard({
  event,
  orders,
}: {
  event: Event;
  orders: OrderWithAttendee[];
}) {
  const upcoming = isUpcoming(event.date);
  return (
    <li className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-semibold text-white truncate">{event.title}</h2>
          <p className="text-sm text-zinc-400 mt-0.5">
            {formatDate(event.date)} · {event.time}
          </p>
          <p className="text-sm text-zinc-500 truncate mt-0.5">{event.location}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {event.cancelledAt && (
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-900/50 text-amber-300">
              Cancelled
            </span>
          )}
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              upcoming
                ? "bg-zinc-700 text-zinc-300"
                : "bg-zinc-800 text-zinc-500"
            }`}
          >
            {upcoming ? "Upcoming" : "Past"}
          </span>
          <Link
            href={`/events/${event.id}/edit`}
            className="rounded-full border border-zinc-600 bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
          >
            Edit
          </Link>
          <Link
            href={`/events/${event.id}`}
            className="rounded-full border border-zinc-600 bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
          >
            View
          </Link>
        </div>
      </div>
      <div className="border-t border-zinc-800 px-5 py-4">
        <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3">
          Orders ({orders.length})
        </h3>
        {orders.length === 0 ? (
          <p className="text-sm text-zinc-500">No tickets sold yet.</p>
        ) : (
          <ul className="space-y-2">
            {orders.map((order) => (
              <li
                key={order.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm"
              >
                <span className="font-medium text-white">
                  {order.attendeeName || order.attendeeEmail || "Attendee"}
                </span>
                {order.attendeeEmail && order.attendeeName && (
                  <span className="text-zinc-500 truncate">{order.attendeeEmail}</span>
                )}
                <span className="text-zinc-500">
                  {formatOrderDate(order.createdAt)}
                </span>
                <span className="text-zinc-400">
                  {order.quantity} {order.quantity === 1 ? "ticket" : "tickets"} · {formatPrice(order.totalPrice)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
