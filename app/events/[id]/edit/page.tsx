import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getEventById } from "@/lib/events";
import EditEventForm from "./EditEventForm";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/organizer");
  }

  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  if (event.createdBy !== session.user.id) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/organizer"
        className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        ← Back to Organizer
      </Link>
      <h1 className="text-2xl font-bold text-white mb-2">Edit event</h1>
      <p className="text-zinc-400 mb-8">
        Update the details below. Changes are saved to the database.
      </p>
      <EditEventForm event={event} />
    </main>
  );
}
