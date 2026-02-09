import { Package, ChevronDown, ChevronUp, Ticket } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/data/events';
import { OrderRow, TicketRow } from '@/hooks/useOrders';

interface OrderCardProps {
  order: OrderRow;
  tickets: TicketRow[];
}

export const OrderCard = ({ order, tickets }: OrderCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const orderTickets = tickets.filter((t) => t.order_id === order.id);

  const statusColors: Record<string, string> = {
    confirmed: 'bg-success/20 text-success border-success/30',
    pending: 'bg-warning/20 text-warning border-warning/30',
    cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
    refunded: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Order Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-display font-bold text-foreground">
              Order #{order.order_number}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              {' · '}
              {orderTickets.length} ticket{orderTickets.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-bold text-accent">{formatPrice(order.total)}</p>
            <Badge variant="outline" className={statusColors[order.status] || statusColors.confirmed}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-border p-5 space-y-4 animate-fade-in">
          {/* Billing */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Billed to</p>
              <p className="text-foreground font-medium">
                {order.billing_first_name} {order.billing_last_name}
              </p>
              <p className="text-muted-foreground">{order.billing_email}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Payment Summary</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="text-foreground">{formatPrice(order.service_fee)}</span>
                </div>
                <div className="flex justify-between font-bold pt-1 border-t border-border">
                  <span className="text-foreground">Total</span>
                  <span className="text-accent">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tickets in order */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Tickets</p>
            <div className="space-y-2">
              {orderTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between bg-secondary/30 rounded-xl p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Ticket className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{ticket.event_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {ticket.section_name} · Row {ticket.row_name} · Seat {ticket.seat_number}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{formatPrice(ticket.price)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
