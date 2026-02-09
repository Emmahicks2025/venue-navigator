import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
    venueId: dbEvent.venue_name, // use venue_name as venueId for DB events
    venueName: dbEvent.venue_name,
    date: dbEvent.date,
    time: dbEvent.time,
    description: dbEvent.description || '',
    isFeatured: dbEvent.is_featured,
    minPrice: Number(dbEvent.min_price),
    maxPrice: Number(dbEvent.max_price),
  };
}

export function useWorldCupEvents() {
  return useQuery({
    queryKey: ['world-cup-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .ilike('name', '%World Cup%')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;
      return data as DbEvent[];
    },
  });
}

export function useEventById(id: string | undefined) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as DbEvent | null;
    },
    enabled: !!id,
  });
}

export function useDbEvents(searchQuery?: string) {
  return useQuery({
    queryKey: ['db-events', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,venue_name.ilike.%${searchQuery}%,performer.ilike.%${searchQuery}%,venue_city.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(200);
      if (error) throw error;
      return data as DbEvent[];
    },
  });
}

export function useDbEventsByCategory(category: string | undefined) {
  return useQuery({
    queryKey: ['db-events-category', category],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query.limit(200);
      if (error) throw error;
      return data as DbEvent[];
    },
  });
}

export function useFeaturedDbEvents() {
  return useQuery({
    queryKey: ['db-events-featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_featured', true)
        .order('date', { ascending: true })
        .limit(20);

      if (error) throw error;
      return data as DbEvent[];
    },
  });
}

export function useDbEventsByCity(city: string | undefined) {
  return useQuery({
    queryKey: ['db-events-city', city],
    queryFn: async () => {
      if (!city) return [];
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .ilike('venue_city', `%${city}%`)
        .order('date', { ascending: true })
        .limit(20);

      if (error) throw error;
      return data as DbEvent[];
    },
    enabled: !!city,
  });
}

export function useDbCategoryCounts() {
  return useQuery({
    queryKey: ['db-category-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('category');

      if (error) throw error;

      const counts: Record<string, number> = {};
      (data || []).forEach((row: { category: string }) => {
        counts[row.category] = (counts[row.category] || 0) + 1;
      });
      return counts;
    },
  });
}
