import { useState } from 'react';
import { Calendar, MapPin, Clock, Ticket, Send, QrCode, ChevronDown, ChevronUp, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/data/events';
import { TicketRow, OrderRow } from '@/hooks/useOrders';
import { TransferTicketDialog } from './TransferTicketDialog';

interface EventGroupCardProps {
  eventId: string;
  tickets: TicketRow[];
  orders?: OrderRow[];
  isPast?: boolean;
}

export const EventGroupCard = ({ eventId, tickets, orders = [], isPast = false }: EventGroupCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [transferTicket, setTransferTicket] = useState<TicketRow | null>(null);
  const [showBarcodeFor, setShowBarcodeFor] = useState<string | null>(null);

  // Use first ticket for event-level info
  const firstTicket = tickets[0];
  const activeCount = tickets.filter(t => t.status === 'active').length;
  const totalValue = tickets.reduce((sum, t) => sum + t.price, 0);
  
  // Find order number from orders
  const orderNumber = orders.find(o => o.id === firstTicket.order_id)?.order_number;

  return (
    <>
      <div className={`bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/30 ${isPast ? 'opacity-70' : ''}`}>
        {/* Event Header - always visible, clickable to expand */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left flex flex-col sm:flex-row"
        >
          {/* Event Image */}
          <div className="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0">
            {firstTicket.performer_image ? (
              <img
                src={firstTicket.performer_image}
                alt={firstTicket.event_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center">
                <Ticket className="w-10 h-10 text-muted-foreground" />
              </div>
            )}
            <div className="date-badge">
              {new Date(firstTicket.event_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()}
            </div>
          </div>

          {/* Event Summary */}
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">{firstTicket.event_name}</h3>
                {firstTicket.performer && (
                  <p className="text-sm text-muted-foreground">{firstTicket.performer}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  {tickets.length} {tickets.length === 1 ? 'Ticket' : 'Tickets'}
                </Badge>
                {expanded ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{firstTicket.venue_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{formatDate(firstTicket.event_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>{firstTicket.event_time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-primary" />
                <span>{activeCount} active · {formatPrice(totalValue)} total</span>
              </div>
              {orderNumber && (
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-primary" />
                  <span className="font-mono">{orderNumber}</span>
                </div>
              )}
            </div>
          </div>
        </button>

        {/* Expanded Ticket List */}
        {expanded && (
          <div className="border-t border-border">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 border-b border-border last:border-b-0 bg-secondary/20"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Ticket className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {ticket.section_name} · Row {ticket.row_name} · Seat {ticket.seat_number}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatPrice(ticket.price)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        ticket.status === 'active'
                          ? 'bg-success/20 text-success border-success/30 text-xs'
                          : ticket.status === 'transferred'
                          ? 'bg-warning/20 text-warning border-warning/30 text-xs'
                          : 'bg-muted text-muted-foreground border-border text-xs'
                      }
                    >
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </Badge>

                    {ticket.status === 'active' && !isPast && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTransferTicket(ticket);
                        }}
                        className="gap-1 text-xs h-7"
                      >
                        <Send className="w-3 h-3" />
                        Transfer
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowBarcodeFor(showBarcodeFor === ticket.id ? null : ticket.id);
                      }}
                      className="gap-1 text-xs h-7"
                    >
                      <QrCode className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {showBarcodeFor === ticket.id && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="bg-foreground/5 border border-border rounded-xl p-4 text-center">
                      <div className="flex justify-center gap-0.5 mb-2">
                        {ticket.barcode.slice(0, 24).split('').map((char, i) => (
                          <div
                            key={i}
                            className="bg-foreground"
                            style={{
                              width: parseInt(char, 36) % 2 === 0 ? '2px' : '3px',
                              height: '40px',
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground font-mono tracking-widest">
                        {ticket.barcode.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

          </div>
        )}
      </div>

      {transferTicket && (
        <TransferTicketDialog
          open={!!transferTicket}
          onOpenChange={(open) => !open && setTransferTicket(null)}
          ticket={transferTicket}
          onTransferComplete={() => setTransferTicket(null)}
        />
      )}
    </>
  );
};
