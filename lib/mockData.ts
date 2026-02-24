/**
 * Mock data for the ticketing app — no database yet.
 * Each event has: id, title, description, date, time, location, price, imageUrl, organizer.
 */

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  imageUrl: string;
  organizer: string;
  /** Set when the event creator; used for edit/cancel auth. */
  createdBy?: string | null;
  /** Set when the organizer cancels the event; hidden from Explore, shown as cancelled. */
  cancelledAt?: string | null;
};

export const events: Event[] = [
  {
    id: "1",
    title: "Jazz Under the Stars",
    description: "An evening of live jazz in the park. Bring a blanket and enjoy smooth tunes as the sun sets.",
    date: "2025-03-15",
    time: "7:00 PM",
    location: "Riverside Park Amphitheater",
    price: 25,
    imageUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80",
    organizer: "City Arts Council",
  },
  {
    id: "2",
    title: "Startup Pitch Night",
    description: "Watch 10 early-stage startups pitch to investors. Networking and drinks included.",
    date: "2025-03-22",
    time: "6:00 PM",
    location: "The Foundry, 123 Innovation Way",
    price: 0,
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    organizer: "Tech Hub",
  },
  {
    id: "3",
    title: "Yoga & Brunch",
    description: "Morning flow followed by a healthy brunch. All levels welcome.",
    date: "2025-03-08",
    time: "9:00 AM",
    location: "Sunrise Studio, Downtown",
    price: 35,
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    organizer: "Wellness Collective",
  },
  {
    id: "4",
    title: "Comedy Night",
    description: "Stand-up comedy with local and touring acts. 21+ with full bar.",
    date: "2025-03-28",
    time: "8:00 PM",
    location: "Laugh Factory",
    price: 20,
    imageUrl: "https://images.unsplash.com/photo-1585699324551-f6c91c257c0f?w=800&q=80",
    organizer: "Laugh Factory",
  },
  {
    id: "5",
    title: "Craft Beer Festival",
    description: "Sample 50+ breweries. Live music, food trucks, and unlimited tastings.",
    date: "2025-04-05",
    time: "12:00 PM",
    location: "Harbor Pavilion",
    price: 55,
    imageUrl: "https://images.unsplash.com/photo-1532635241-17e820acc59f?w=800&q=80",
    organizer: "Brew Guild",
  },
  {
    id: "6",
    title: "Photography Workshop",
    description: "Learn portrait and street photography. Bring your camera or smartphone.",
    date: "2025-03-18",
    time: "2:00 PM",
    location: "Arts District Studio",
    price: 75,
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    organizer: "Photo School",
  },
];
