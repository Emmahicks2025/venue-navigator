import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Ticket, Send, QrCode, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/data/events';
import { TicketRow } from '@/hooks/useOrders';
import { TransferTicketDialog } from './TransferTicketDialog';

interface DashboardTicketCardProps {
  ticket: TicketRow;
  isPast?: boolean;
  onTransferInitiated?: () => void;
}

export const DashboardTicketCard = ({ ticket, isPast = false, onTransferInitiated }: DashboardTicketCardProps) => {
  const [showBarcode, setShowBarcode] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  const statusColors: Record<string, string> = {
    active: 'bg-success/20 text-success border-success/30',
    transferred: 'bg-warning/20 text-warning border-warning/30',
    used: 'bg-muted text-muted-foreground border-border',
    cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
  };

  return (
    <>
      <div className={`bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/30 ${isPast ? 'opacity-70' : ''}`}>
        <div className="flex flex-col sm:flex-row">
          {/* Event Image */}
          <div className="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0">
            {ticket.performer_image ? (
              <img
                src={ticket.performer_image}
                alt={ticket.event_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center">
                <Ticket className="w-10 h-10 text-muted-foreground" />
              </div>
            )}
            {/* Date badge */}
            <div className="date-badge">
              {new Date(ticket.event_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()}
            </div>
          </div>

          {/* Ticket Details */}
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <Link to={`/event/${ticket.event_id}`} className="hover:text-primary transition-colors">
                  <h3 className="font-display text-lg font-bold text-foreground">{ticket.event_name}</h3>
                </Link>
                {ticket.performer && (
                  <p className="text-sm text-muted-foreground">{ticket.performer}</p>
                )}
              </div>
              <Badge variant="outline" className={statusColors[ticket.status] || statusColors.active}>
                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{ticket.venue_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{formatDate(ticket.event_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>{ticket.event_time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-primary" />
              <span>{ticket.section_name} · Row {ticket.row_name} · Seat {ticket.seat_number}</span>
              </div>
            </div>

            {/* Delivery Instructions */}
            <div className="mb-4 p-3 bg-secondary/50 border border-border rounded-lg">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">📋 Instructions: </span>
                {(ticket as any).remarks || "You will receive your tickets from the seller. Please check your email for delivery instructions and updates regarding your order."}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-accent">{formatPrice(ticket.price)}</p>

              <div className="flex items-center gap-2">
                {ticket.status === 'active' && !isPast && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTransfer(true)}
                    className="gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Transfer
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBarcode(!showBarcode)}
                  className="gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  {showBarcode ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </Button>
              </div>
            </div>

            {/* Barcode area */}
            {showBarcode && (
              <div className="mt-4 pt-4 border-t border-border">
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
        </div>
      </div>

      <TransferTicketDialog
        open={showTransfer}
        onOpenChange={setShowTransfer}
        ticket={ticket}
        onTransferComplete={() => {
          setShowTransfer(false);
          onTransferInitiated?.();
        }}
      />
    </>
  );
};
