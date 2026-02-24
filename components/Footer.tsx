import Link from "next/link";

/**
 * Footer — simple site footer with links and copyright.
 */
export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800 bg-zinc-900/50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} TicketHub. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Events
            </Link>
            <Link
              href="/events/create"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Create Event
            </Link>
            <Link
              href="/checkout"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
