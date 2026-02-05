import { useState, useMemo } from 'react';
import { VenueSection, SelectedSeat } from '@/types';
import { formatPrice } from '@/data/events';
import { Button } from '@/components/ui/button';
import { X, Info, Plus, Minus, ShoppingCart, CreditCard } from 'lucide-react';
import { SVGSection } from '@/lib/svgParser';
import { getAvailableTickets } from './InteractiveSVGMap';

interface TicketOption {
  id: string;
  row: string;
  seats: number;
  availableSeats: number[]; // Random seat numbers available
  price: number;
  note?: string;
  isLowestPrice?: boolean;
}

interface TicketListProps {
  section: VenueSection;
  svgSection: SVGSection;
  onTicketsSelected: (seats: SelectedSeat[], goToCheckout?: boolean) => void;
  onClose: () => void;
}

// Generate random unique seat numbers
const generateRandomSeatNumbers = (count: number, maxSeat: number = 30): number[] => {
  const seats = new Set<number>();
  while (seats.size < count) {
    seats.add(Math.floor(Math.random() * maxSeat) + 1);
  }
  return Array.from(seats).sort((a, b) => a - b);
};

// Generate mock ticket options for a section
const generateTicketOptions = (section: VenueSection, svgSection: SVGSection): TicketOption[] => {
  const options: TicketOption[] = [];
  const basePrice = svgSection.currentPrice;
  const rows = Math.min(section.rows, 10);
  
  // Generate ticket listings for different rows
  for (let i = 0; i < rows; i++) {
    const rowLetter = String.fromCharCode(65 + i);
    const priceVariation = 1 + (Math.random() * 0.15 - 0.075); // ±7.5% variation
    const ticketCount = Math.floor(Math.random() * 6) + 1; // 1-6 tickets
    const availableSeats = generateRandomSeatNumbers(ticketCount);
    
    options.push({
      id: `${section.id}-${rowLetter}`,
      row: `Row ${rowLetter}`,
      seats: ticketCount,
      availableSeats,
      price: Math.round(basePrice * priceVariation * 100) / 100,
      note: i % 3 === 0 ? 'Clear view, You will be seated together.' : undefined,
    });
  }
  
  // Sort by price and mark lowest
  const sorted = options.sort((a, b) => a.price - b.price);
  if (sorted.length > 0) {
    sorted[0].isLowestPrice = true;
  }
  return sorted;
};

export const TicketList = ({ section, svgSection, onTicketsSelected, onClose }: TicketListProps) => {
  // Per-row quantity state
  const [rowQuantities, setRowQuantities] = useState<Record<string, number>>({});
  
  // Memoize ticket options so they don't regenerate on every render
  const ticketOptions = useMemo(() => generateTicketOptions(section, svgSection), [section.id, svgSection.id]);
  const availableCount = getAvailableTickets(svgSection);

  const getRowQuantity = (ticketId: string, maxSeats: number) => {
    return rowQuantities[ticketId] ?? Math.min(2, maxSeats);
  };

  const setRowQuantity = (ticketId: string, quantity: number) => {
    setRowQuantities(prev => ({ ...prev, [ticketId]: quantity }));
  };

  const handleSelect = (ticket: TicketOption, goToCheckout: boolean = false) => {
    const qty = getRowQuantity(ticket.id, ticket.seats);
    const selectedSeatNumbers = ticket.availableSeats.slice(0, qty);
    
    const seats: SelectedSeat[] = selectedSeatNumbers.map(seatNum => ({
      sectionName: section.name,
      row: ticket.row.replace('Row ', ''),
      seatNumber: seatNum,
      price: ticket.price,
    }));
    onTicketsSelected(seats, goToCheckout);
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">{section.name}</h3>
          <p className="text-sm text-muted-foreground">{availableCount} tickets available</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Urgency Banner */}
      <div className="flex items-center gap-2 px-6 py-3 bg-accent/10">
        <span className="text-accent">🔥</span>
        <span className="text-sm text-accent font-medium">Tickets are selling fast! Secure yours now.</span>
      </div>

      {/* Ticket List */}
      <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
        {ticketOptions.map((ticket) => {
          const currentQty = getRowQuantity(ticket.id, ticket.seats);
          const hasMultipleTickets = ticket.seats > 1;
          
          return (
            <div
              key={ticket.id}
              className="px-6 py-4 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-foreground">{section.name}</p>
                    {ticket.isLowestPrice && (
                      <span className="text-[10px] font-bold text-success bg-success/20 px-2 py-0.5 rounded uppercase tracking-wide">
                        Lowest Price
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {ticket.row} | {ticket.seats} Ticket{ticket.seats > 1 ? 's' : ''} available
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">
                    Seats: {ticket.availableSeats.join(', ')}
                  </p>
                  {ticket.note && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <Info className="w-3 h-3 flex-shrink-0" />
                      <span>{ticket.note}</span>
                    </div>
                  )}
                </div>
                <div className="text-right ml-4">
                  <p className="text-lg font-bold text-foreground">{formatPrice(ticket.price)}</p>
                  <p className="text-xs text-muted-foreground">ea</p>
                </div>
              </div>
              
              {/* Per-row quantity selector and actions */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                {hasMultipleTickets ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Qty:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setRowQuantity(ticket.id, Math.max(1, currentQty - 1))}
                        className="h-7 w-7 rounded-full"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm font-bold text-foreground w-5 text-center">{currentQty}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setRowQuantity(ticket.id, Math.min(ticket.seats, currentQty + 1))}
                        className="h-7 w-7 rounded-full"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      = {formatPrice(ticket.price * currentQty)}
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">1 ticket</div>
                )}
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleSelect(ticket, false)}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => handleSelect(ticket, true)}
                    size="sm"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs"
                  >
                    <CreditCard className="w-3.5 h-3.5 mr-1" />
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-secondary/20 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          All prices include fees. Prices may vary based on availability.
        </p>
      </div>
    </div>
  );
};
