import { useQuery } from '@tanstack/react-query';
import { collection, query, where, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Event, EventCategory } from '@/types';

export interface DbEvent {
  id: string;
  name: string;
  performer: string;
  category: string;
  venue_name: string;
  venue_city: string;
  venue_state: string | null;
  date: string;
  time: string;
  description: string | null;
  performer_image: string | null;
  is_featured: boolean;
  min_price: number;
  max_price: number;
  svg_map_name: string | null;
  match_number: number | null;
  round: string | null;
  group_name: string | null;
  home_team: string | null;
  away_team: string | null;
  ticket_url: string | null;
  source: string | null;
}

/** Map a DB event row to the frontend Event type used by EventCard etc. */
export function mapDbEventToFrontend(dbEvent: DbEvent): Event {
  return {
    id: dbEvent.id,
    name: dbEvent.name,
    performer: dbEvent.performer,
    performerImage: dbEvent.performer_image || '',
    category: (dbEvent.category as EventCategory) || 'concerts',
    venueId: dbEvent.venue_name,
    venueName: dbEvent.venue_name,
    date: dbEvent.date,
    time: dbEvent.time,
    description: dbEvent.description || '',
    isFeatured: dbEvent.is_featured,
    minPrice: Number(dbEvent.min_price),
    maxPrice: Number(dbEvent.max_price),
  };
}

const eventsRef = collection(db, 'events');

/** Helper to convert Firestore doc to DbEvent */
function docToDbEvent(docSnap: any): DbEvent {
  const data = docSnap.data();
  return { id: docSnap.id, ...data } as DbEvent;
}

export function useWorldCupEvents() {
  return useQuery({
    queryKey: ['world-cup-events'],
    queryFn: async () => {
      // Firestore doesn't support ilike, so we fetch all and filter client-side
      const q = query(eventsRef, orderBy('date', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs
        .map(docToDbEvent)
        .filter((e) => e.name.toLowerCase().includes('world cup'));
    },
  });
}

export function useEventById(id: string | undefined) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!id) return null;
      const docSnap = await getDoc(doc(db, 'events', id));
      if (!docSnap.exists()) return null;
      return docToDbEvent(docSnap);
    },
    enabled: !!id,
  });
}

export function useDbEvents(searchQuery?: string) {
  return useQuery({
    queryKey: ['db-events', searchQuery],
    queryFn: async () => {
      const q = query(eventsRef, orderBy('date', 'asc'), limit(200));
      const snapshot = await getDocs(q);
      let events = snapshot.docs.map(docToDbEvent);

      if (searchQuery) {
        const lower = searchQuery.toLowerCase();
        events = events.filter(
          (e) =>
            e.name.toLowerCase().includes(lower) ||
            e.venue_name.toLowerCase().includes(lower) ||
            e.performer.toLowerCase().includes(lower) ||
            e.venue_city.toLowerCase().includes(lower)
        );
      }

      return events;
    },
  });
}

export function useDbEventsByCategory(category: string | undefined) {
  return useQuery({
    queryKey: ['db-events-category', category],
    queryFn: async () => {
      let q;
      if (category && category !== 'all') {
        q = query(eventsRef, where('category', '==', category), orderBy('date', 'asc'), limit(200));
      } else {
        q = query(eventsRef, orderBy('date', 'asc'), limit(200));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map(docToDbEvent);
    },
  });
}

export function useFeaturedDbEvents() {
  return useQuery({
    queryKey: ['db-events-featured'],
    queryFn: async () => {
      const q = query(eventsRef, where('is_featured', '==', true), orderBy('date', 'asc'), limit(20));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(docToDbEvent);
    },
  });
}

export function useDbEventsByCity(city: string | undefined) {
  return useQuery({
    queryKey: ['db-events-city', city],
    queryFn: async () => {
      if (!city) return [];
      // Firestore doesn't support ilike, fetch and filter client-side
      const q = query(eventsRef, orderBy('date', 'asc'), limit(200));
      const snapshot = await getDocs(q);
      const lower = city.toLowerCase();
      return snapshot.docs
        .map(docToDbEvent)
        .filter((e) => e.venue_city.toLowerCase().includes(lower));
    },
    enabled: !!city,
  });
}

export function useDbCategoryCounts() {
  return useQuery({
    queryKey: ['db-category-counts'],
    queryFn: async () => {
      const snapshot = await getDocs(eventsRef);
      const counts: Record<string, number> = {};
      snapshot.docs.forEach((d) => {
        const cat = d.data().category;
        counts[cat] = (counts[cat] || 0) + 1;
      });
      return counts;
    },
  });
}
