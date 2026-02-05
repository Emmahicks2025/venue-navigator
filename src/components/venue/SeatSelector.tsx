import { useState } from 'react';
import { VenueSection, SelectedSeat } from '@/types';
import { formatPrice } from '@/data/events';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, X, Minus, Plus } from 'lucide-react';

interface SeatSelectorProps {
  section: VenueSection;
  onSeatsSelected: (seats: SelectedSeat[]) => void;
  onClose: () => void;
}

export const SeatSelector = ({ section, onSeatsSelected, onClose }: SeatSelectorProps) => {
  const [quantity, setQuantity] = useState(2);
  const [selectedSeats, setSelectedSeats] = useState<{ row: string; number: number }[]>([]);

  const rows = Array.from({ length: Math.min(section.rows, 8) }, (_, i) => 
    String.fromCharCode(65 + i)
  );
  const seatsPerRow = Math.min(section.seatsPerRow, 16);

  // Generate seat availability (mock - some seats are sold)
  const getSeatStatus = (row: string, seatNum: number): 'available' | 'sold' => {
    const hash = (row.charCodeAt(0) * seatNum) % 10;
    return hash < 2 ? 'sold' : 'available';
  };

  const isSeatSelected = (row: string, seatNum: number) => {
    return selectedSeats.some(s => s.row === row && s.number === seatNum);
  };

  const toggleSeat = (row: string, seatNum: number) => {
    if (getSeatStatus(row, seatNum) === 'sold') return;

    setSelectedSeats(prev => {
      const exists = prev.some(s => s.row === row && s.number === seatNum);
      if (exists) {
        return prev.filter(s => !(s.row === row && s.number === seatNum));
      }
      if (prev.length >= 8) return prev; // Max 8 seats
      return [...prev, { row, number: seatNum }];
    });
  };

  const handleConfirm = () => {
    const seats: SelectedSeat[] = selectedSeats.map(s => ({
      sectionName: section.name,
      row: s.row,
      seatNumber: s.number,
      price: section.basePrice,
    }));
    onSeatsSelected(seats);
  };

  const totalPrice = selectedSeats.length * section.basePrice;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 animate-scale-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">{section.name}</h3>
          <p className="text-sm text-muted-foreground">{formatPrice(section.basePrice)} per seat</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Quick Quantity Selector */}
      <div className="mb-6 p-4 bg-secondary/50 rounded-xl">
        <p className="text-sm font-medium text-foreground mb-3">Quick select quantity:</p>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="rounded-full"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="text-xl font-bold text-foreground w-8 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.min(8, quantity + 1))}
            className="rounded-full"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground ml-2">tickets</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="mb-6">
        <div className="text-center mb-4">
          <div className="inline-block px-8 py-2 bg-muted rounded-t-xl text-xs font-medium text-muted-foreground">
            STAGE
          </div>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="inline-block min-w-full">
            {rows.map((row) => (
              <div key={row} className="flex items-center gap-1 mb-1">
                <span className="w-6 text-xs font-medium text-muted-foreground text-center">{row}</span>
                <div className="flex gap-1">
                  {Array.from({ length: seatsPerRow }, (_, i) => i + 1).map((seatNum) => {
                    const status = getSeatStatus(row, seatNum);
                    const isSelected = isSeatSelected(row, seatNum);

                    return (
                      <button
                        key={`${row}-${seatNum}`}
                        onClick={() => toggleSeat(row, seatNum)}
                        disabled={status === 'sold'}
                        className={cn(
                          'w-6 h-6 rounded text-[10px] font-medium transition-all duration-200',
                          status === 'sold' && 'bg-muted text-muted-foreground cursor-not-allowed',
                          status === 'available' && !isSelected && 'bg-success/20 text-success hover:bg-success/40',
                          isSelected && 'bg-accent text-accent-foreground scale-110'
                        )}
                      >
                        {isSelected ? <Check className="w-3 h-3 mx-auto" /> : seatNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-success/20 border border-success" />
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-accent" />
            <span className="text-muted-foreground">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted" />
            <span className="text-muted-foreground">Sold</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
            </p>
            <p className="text-2xl font-bold text-accent">{formatPrice(totalPrice)}</p>
          </div>
          <Button
            onClick={handleConfirm}
            disabled={selectedSeats.length === 0}
            className="bg-accent hover:bg-accent/90 text-accent-foreground btn-accent-glow px-8"
          >
            Add to Cart
          </Button>
        </div>

        {selectedSeats.length > 0 && (
          <div className="text-xs text-muted-foreground">
            Seats: {selectedSeats.map(s => `${section.name} Row ${s.row}, Seat ${s.number}`).join(' • ')}
          </div>
        )}
      </div>
    </div>
  );
};
