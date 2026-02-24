import Link from "next/link";

/**
 * Header — site navigation. Links to Home, Create Event, and (optionally) Checkout.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold text-white hover:text-amber-400 transition-colors"
        >
          TicketHub
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Events
          </Link>
          <Link
            href="/events/create"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Create Event
          </Link>
          <Link
            href="/checkout"
            className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
          >
            Checkout
          </Link>
        </nav>
      </div>
    </header>
  );
}
