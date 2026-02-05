import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface WorldCupEvent {
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
      return data as WorldCupEvent[];
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
      return data as WorldCupEvent | null;
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
        query = query.or(`name.ilike.%${searchQuery}%,venue_name.ilike.%${searchQuery}%,performer.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(200);
      if (error) throw error;
      return data as WorldCupEvent[];
    },
  });
}
