import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface OrderRow {
  id: string;
  order_number: string;
  status: string;
  subtotal: number;
  service_fee: number;
  total: number;
  billing_email: string | null;
  billing_first_name: string | null;
  billing_last_name: string | null;
  created_at: string;
}

export interface TicketRow {
  id: string;
  order_id: string;
  event_id: string;
  event_name: string;
  event_date: string;
  event_time: string;
  venue_name: string;
  performer: string | null;
  performer_image: string | null;
  section_name: string;
  row_name: string;
  seat_number: number;
  price: number;
  status: string;
  barcode: string;
  created_at: string;
}

export interface TransferRow {
  id: string;
  ticket_id: string;
  from_user_id: string;
  to_email: string;
  to_user_id: string | null;
  status: string;
  message: string | null;
  created_at: string;
}

export function useUserOrders() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-orders', user?.uid],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as OrderRow[];
    },
    enabled: !!user,
  });
}

export function useUserTickets() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-tickets', user?.uid],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', user.uid)
        .order('event_date', { ascending: true });

      if (error) throw error;
      const tickets = data as TicketRow[];

      // Enrich tickets missing performer_image from performer_images table
      const missingImage = tickets.filter((t) => !t.performer_image && t.performer);
      if (missingImage.length > 0) {
        const performerNames = [...new Set(missingImage.map((t) => t.performer!))];
        const { data: images } = await supabase
          .from('performer_images')
          .select('performer_name, image_url')
          .in('performer_name', performerNames);

        if (images && images.length > 0) {
          const imageMap = new Map(images.map((img) => [img.performer_name, img.image_url]));
          tickets.forEach((t) => {
            if (!t.performer_image && t.performer && imageMap.has(t.performer)) {
              t.performer_image = imageMap.get(t.performer)!;
            }
          });
        }
      }

      return tickets;
    },
    enabled: !!user,
  });
}

export function useUserTransfers() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-transfers', user?.uid],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('ticket_transfers')
        .select('*')
        .eq('from_user_id', user.uid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TransferRow[];
    },
    enabled: !!user,
  });
}
