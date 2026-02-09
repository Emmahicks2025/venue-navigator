
-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'confirmed',
  subtotal NUMERIC NOT NULL DEFAULT 0,
  service_fee NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  billing_email TEXT,
  billing_first_name TEXT,
  billing_last_name TEXT,
  billing_address TEXT,
  billing_city TEXT,
  billing_zip TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tickets table (individual tickets within an order)
CREATE TABLE public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_date TEXT NOT NULL,
  event_time TEXT NOT NULL DEFAULT '19:00',
  venue_name TEXT NOT NULL,
  performer TEXT,
  performer_image TEXT,
  section_name TEXT NOT NULL,
  row_name TEXT NOT NULL,
  seat_number INTEGER NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  barcode TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ticket transfers table
CREATE TABLE public.ticket_transfers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_email TEXT NOT NULL,
  to_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_transfers ENABLE ROW LEVEL SECURITY;

-- Orders RLS: users can only see/create their own orders
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Tickets RLS: users can see their own tickets
CREATE POLICY "Users can view their own tickets"
  ON public.tickets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tickets"
  ON public.tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets"
  ON public.tickets FOR UPDATE
  USING (auth.uid() = user_id);

-- Ticket transfers RLS
CREATE POLICY "Users can view transfers they sent"
  ON public.ticket_transfers FOR SELECT
  USING (auth.uid() = from_user_id);

CREATE POLICY "Users can view transfers they received"
  ON public.ticket_transfers FOR SELECT
  USING (auth.uid() = to_user_id);

CREATE POLICY "Users can create transfers for their tickets"
  ON public.ticket_transfers FOR INSERT
  WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can update transfers they sent"
  ON public.ticket_transfers FOR UPDATE
  USING (auth.uid() = from_user_id);

-- Triggers for updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ticket_transfers_updated_at
  BEFORE UPDATE ON public.ticket_transfers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Index for faster lookups
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX idx_tickets_order_id ON public.tickets(order_id);
CREATE INDEX idx_tickets_event_id ON public.tickets(event_id);
CREATE INDEX idx_ticket_transfers_ticket_id ON public.ticket_transfers(ticket_id);
CREATE INDEX idx_ticket_transfers_from_user ON public.ticket_transfers(from_user_id);
CREATE INDEX idx_ticket_transfers_to_email ON public.ticket_transfers(to_email);
