import { useState } from 'react';
import { VenueSection, SelectedSeat } from '@/types';
import { formatPrice } from '@/data/events';
import { Button } from '@/components/ui/button';
import { X, Info, Plus, Minus, ShoppingCart } from 'lucide-react';
import { SVGSection } from '@/lib/svgParser';
import { getAvailableTickets } from './InteractiveSVGMap';

interface TicketOption {
  id: string;
  row: string;
  seats: number;
  price: number;
  note?: string;
  isLowestPrice?: boolean;
}

interface TicketListProps {
  section: VenueSection;
  svgSection: SVGSection;
  onTicketsSelected: (seats: SelectedSeat[]) => void;
  onClose: () => void;
}

// Generate mock ticket options for a section
const generateTicketOptions = (section: VenueSection, svgSection: SVGSection): TicketOption[] => {
  const options: TicketOption[] = [];
  const basePrice = svgSection.currentPrice;
  const rows = Math.min(section.rows, 10);
  
  // Generate ticket listings for different rows
  for (let i = 0; i < rows; i++) {
    const rowLetter = String.fromCharCode(65 + i);
    const priceVariation = 1 + (Math.random() * 0.15 - 0.075); // ±7.5% variation
    const ticketCount = Math.floor(Math.random() * 4) + 1; // 1-4 tickets
    
    options.push({
      id: `${section.id}-${rowLetter}`,
      row: `Row ${rowLetter}`,
      seats: ticketCount,
      price: Math.round(basePrice * priceVariation * 100) / 100,
      note: i % 3 === 0 ? 'Clear view, You will be seated together.' : undefined,
      isLowestPrice: i === 0,
    });
  }
  
  // Sort by price
  return options.sort((a, b) => a.price - b.price);
};

export const TicketList = ({ section, svgSection, onTicketsSelected, onClose }: TicketListProps) => {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(2);
  
  const ticketOptions = generateTicketOptions(section, svgSection);
  const availableCount = getAvailableTickets(svgSection);

  const handleSelect = (ticket: TicketOption) => {
    const seats: SelectedSeat[] = Array.from({ length: Math.min(quantity, ticket.seats) }, (_, i) => ({
      sectionName: section.name,
      row: ticket.row.replace('Row ', ''),
      seatNumber: i + 1,
      price: ticket.price,
    }));
    onTicketsSelected(seats);
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/30">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">{section.name}</h3>
          <p className="text-sm text-muted-foreground">{availableCount} tickets available</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Urgency Banner */}
      <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 border-b border-border">
        <span className="text-accent text-sm">🔥</span>
        <span className="text-sm text-accent font-medium">Tickets are selling fast! Secure yours now.</span>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm text-muted-foreground">Number of tickets:</span>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="h-8 w-8 rounded-full"
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="text-lg font-bold text-foreground w-6 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.min(8, quantity + 1))}
            className="h-8 w-8 rounded-full"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Ticket List */}
      <div className="max-h-[400px] overflow-y-auto">
        {ticketOptions.map((ticket) => (
          <div
            key={ticket.id}
            className="flex items-center justify-between p-4 border-b border-border hover:bg-secondary/30 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-foreground">{section.name}</p>
                {ticket.isLowestPrice && (
                  <span className="text-[10px] font-bold text-success bg-success/20 px-2 py-0.5 rounded uppercase">
                    Lowest Price
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                {ticket.row} | {ticket.seats} Ticket{ticket.seats > 1 ? 's' : ''}
              </p>
              {ticket.note && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Info className="w-3 h-3" />
                  <span>{ticket.note}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">{formatPrice(ticket.price)}</p>
                <p className="text-xs text-muted-foreground">ea</p>
              </div>
              <Button
                onClick={() => handleSelect(ticket)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
              >
                Select
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 bg-secondary/30 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          All prices include fees. Prices may vary based on availability.
        </p>
      </div>
    </div>
  );
};
