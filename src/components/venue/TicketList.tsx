import { useState, useMemo } from 'react';
import { VenueSection, SelectedSeat } from '@/types';
import { formatPrice } from '@/data/events';
import { Button } from '@/components/ui/button';
import { X, Info, Plus, Minus, ShoppingCart, CreditCard, Trophy } from 'lucide-react';
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
  matchCategory?: {
    round?: string | null;
    groupName?: string | null;
    matchNumber?: number | null;
    isWorldCup?: boolean;
  };
}

// Generate consecutive seat numbers starting from a random position
const generateConsecutiveSeatNumbers = (count: number, maxSeat: number = 30): number[] => {
  // Pick a random starting seat that allows for consecutive seats
  const maxStart = Math.max(1, maxSeat - count + 1);
  const startSeat = Math.floor(Math.random() * maxStart) + 1;
  
  // Generate consecutive seats from the starting position
  return Array.from({ length: count }, (_, i) => startSeat + i);
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
    const availableSeats = generateConsecutiveSeatNumbers(ticketCount);
    
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

export const TicketList = ({ section, svgSection, onTicketsSelected, onClose, matchCategory }: TicketListProps) => {
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
    <div className="flex flex-col h-full bg-background">
      {/* Drag Handle */}
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-12 h-1.5 rounded-full bg-muted" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-3 border-b border-border">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">{section.name}</h3>
          <p className="text-sm text-muted-foreground">{availableCount} tickets available</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Urgency Banner */}
      <div className="flex items-center justify-center gap-2 px-5 py-2 bg-accent/10">
        <span className="text-accent text-sm">🔥</span>
        <span className="text-xs text-accent font-medium">Tickets selling fast!</span>
      </div>

      {/* FIFA World Cup Category Badge */}
      {matchCategory?.isWorldCup && matchCategory.round && (
        <div className="px-5 py-2.5 bg-gradient-to-r from-[#02B906]/15 via-[#02B906]/10 to-[#FFDB00]/15 border-b border-[#02B906]/20">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-[#FFDB00] to-[#FFB800] shadow-sm">
              <Trophy className="w-3.5 h-3.5 text-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#02B906]">
                FIFA World Cup 2026™
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-foreground">
                  {matchCategory.round}
                </span>
                {matchCategory.groupName && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-[#02B906] text-white">
                    Group {matchCategory.groupName}
                  </span>
                )}
                {matchCategory.matchNumber && (
                  <span className="text-xs text-muted-foreground">
                    · Match {matchCategory.matchNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket List - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {ticketOptions.map((ticket) => {
          const currentQty = getRowQuantity(ticket.id, ticket.seats);
          const hasMultipleTickets = ticket.seats > 1;
          
          return (
            <div
              key={ticket.id}
              className="px-5 py-4 border-b border-border last:border-b-0 hover:bg-secondary/20 transition-colors"
            >
              {/* Row Info */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">{section.name}</span>
                    {ticket.isLowestPrice && (
                      <span className="text-[10px] font-bold text-success bg-success/20 px-1.5 py-0.5 rounded uppercase">
                        Best Price
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {ticket.row} • {ticket.seats} ticket{ticket.seats > 1 ? 's' : ''}
                  </p>
                  {matchCategory?.isWorldCup ? (
                    <p className="text-xs font-medium text-[#FFDB00]/80 mt-1 flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      Seats will be assigned later by FIFA
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground/70">
                      Seats: {ticket.availableSeats.join(', ')}
                    </p>
                  )}
                  {ticket.seats > 1 && (
                    <div className="flex items-center gap-1 text-xs text-success mt-1">
                      <span className="inline-flex items-center gap-1 bg-success/15 text-success px-2 py-0.5 rounded-full font-medium">
                        ✓ Seated together
                      </span>
                    </div>
                  )}
                  {ticket.note && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Info className="w-3 h-3" />
                      <span>{ticket.note}</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">{formatPrice(ticket.price)}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">per ticket</p>
                </div>
              </div>
              
              {/* Quantity & Actions Row */}
              <div className="flex items-center justify-between gap-3 mt-3">
                {/* Quantity Selector */}
                {hasMultipleTickets ? (
                  <div className="flex items-center gap-2 bg-secondary/50 rounded-full px-2 py-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setRowQuantity(ticket.id, Math.max(1, currentQty - 1))}
                      className="h-6 w-6 rounded-full hover:bg-background"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-bold text-foreground w-4 text-center">{currentQty}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setRowQuantity(ticket.id, Math.min(ticket.seats, currentQty + 1))}
                      className="h-6 w-6 rounded-full hover:bg-background"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <span className="text-xs font-medium text-accent ml-1">
                      {formatPrice(ticket.price * currentQty)}
                    </span>
                  </div>
                ) : (
                  <div className="bg-secondary/50 rounded-full px-3 py-1.5">
                    <span className="text-xs text-muted-foreground">1 ticket • {formatPrice(ticket.price)}</span>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleSelect(ticket, false)}
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs px-3"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                    Cart
                  </Button>
                  <Button
                    onClick={() => handleSelect(ticket, true)}
                    size="sm"
                    className="h-8 bg-accent hover:bg-accent/90 text-accent-foreground text-xs px-3"
                  >
                    <CreditCard className="w-3.5 h-3.5 mr-1" />
                    Buy
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-secondary/30 border-t border-border">
        <p className="text-[10px] text-muted-foreground text-center">
          All prices include fees. Prices may vary based on availability.
        </p>
      </div>
    </div>
  );
};
