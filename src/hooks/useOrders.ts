import { useQuery } from '@tanstack/react-query';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
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
      const q = query(
        collection(db, 'orders'),
        where('user_id', '==', user.uid),
        orderBy('created_at', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as OrderRow));
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
      const q = query(
        collection(db, 'tickets'),
        where('user_id', '==', user.uid),
        orderBy('event_date', 'asc')
      );
      const snapshot = await getDocs(q);
      const tickets = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as TicketRow));

      // Enrich tickets missing performer_image from performer_images collection
      const missingImage = tickets.filter((t) => !t.performer_image && t.performer);
      if (missingImage.length > 0) {
        const performerNames = [...new Set(missingImage.map((t) => t.performer!))];
        const imgQuery = query(
          collection(db, 'performer_images'),
          where('performer_name', 'in', performerNames.slice(0, 30)) // Firestore 'in' limit is 30
        );
        const imgSnapshot = await getDocs(imgQuery);
        const imageMap = new Map(
          imgSnapshot.docs.map((d) => [d.data().performer_name, d.data().image_url])
        );
        tickets.forEach((t) => {
          if (!t.performer_image && t.performer && imageMap.has(t.performer)) {
            t.performer_image = imageMap.get(t.performer)!;
          }
        });
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
      const q = query(
        collection(db, 'ticket_transfers'),
        where('from_user_id', '==', user.uid),
        orderBy('created_at', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as TransferRow));
    },
    enabled: !!user,
  });
}
