import { useState } from 'react';
import { Trophy, Users, Eye, Minus, Plus, ShoppingCart, CreditCard, Shield, Ticket, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectedSeat } from '@/types';
import { SVGSection } from '@/lib/svgParser';
import { formatPrice } from '@/data/events';
import { cn } from '@/lib/utils';

export interface FIFACategory {
  id: string;
  name: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeColor: string;
  sections: SVGSection[];
  priceRange: { min: number; max: number };
  totalAvailable: number;
}

interface FIFATicketCategoriesProps {
  sections: SVGSection[];
  onTicketsSelected: (seats: SelectedSeat[], goToCheckout?: boolean) => void;
}

// Classify sections into FIFA-style categories based on price tiers
function classifySections(sections: SVGSection[]): FIFACategory[] {
  if (sections.length === 0) return [];

  const available = sections.filter(s => s.available);
  if (available.length === 0) return [];

  const sorted = [...available].sort((a, b) => b.currentPrice - a.currentPrice);
  
  const totalSections = sorted.length;
  const cat1Count = Math.max(1, Math.ceil(totalSections * 0.25));
  const cat2Count = Math.max(1, Math.ceil(totalSections * 0.35));

  const cat1Sections = sorted.slice(0, cat1Count);
  const cat2Sections = sorted.slice(cat1Count, cat1Count + cat2Count);
  const cat3Sections = sorted.slice(cat1Count + cat2Count);

  const buildCategory = (
    id: string,
    name: string,
    label: string,
    description: string,
    icon: React.ReactNode,
    color: string,
    bgColor: string,
    borderColor: string,
    badgeColor: string,
    catSections: SVGSection[]
  ): FIFACategory | null => {
    if (catSections.length === 0) return null;
    const prices = catSections.map(s => s.currentPrice);
    return {
      id,
      name,
      label,
      description,
      icon,
      color,
      bgColor,
      borderColor,
      badgeColor,
      sections: catSections,
      priceRange: { min: Math.min(...prices), max: Math.max(...prices) },
      totalAvailable: catSections.reduce((sum, s) => sum + Math.floor(s.rows * s.seatsPerRow * 0.7), 0),
    };
  };

  return [
    buildCategory(
      'cat1',
      'Category 1',
      'CAT 1',
      'Premium sideline seats with the best view of the pitch',
      <Star className="w-4 h-4" />,
      'text-yellow-400',
      'bg-yellow-500/10',
      'border-yellow-500/30',
      'bg-gradient-to-r from-yellow-500 to-amber-500',
      cat1Sections
    ),
    buildCategory(
      'cat2',
      'Category 2',
      'CAT 2',
      'Great seats behind the goals and upper sideline areas',
      <Eye className="w-4 h-4" />,
      'text-emerald-400',
      'bg-emerald-500/10',
      'border-emerald-500/30',
      'bg-gradient-to-r from-emerald-500 to-teal-500',
      cat2Sections
    ),
    buildCategory(
      'cat3',
      'Category 3',
      'CAT 3',
      'Upper level seats — great atmosphere at an accessible price',
      <Users className="w-4 h-4" />,
      'text-sky-400',
      'bg-sky-500/10',
      'border-sky-500/30',
      'bg-gradient-to-r from-sky-500 to-blue-500',
      cat3Sections
    ),
  ].filter(Boolean) as FIFACategory[];
}

export function FIFATicketCategories({ sections, onTicketsSelected }: FIFATicketCategoriesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(2);

  const categories = classifySections(sections);

  const handlePurchase = (category: FIFACategory, goToCheckout: boolean) => {
    // Pick a random section from the category
    const section = category.sections[Math.floor(Math.random() * category.sections.length)];
    const row = String.fromCharCode(65 + Math.floor(Math.random() * Math.min(section.rows, 10)));
    const startSeat = Math.floor(Math.random() * Math.max(1, section.seatsPerRow - quantity)) + 1;

    const seats: SelectedSeat[] = Array.from({ length: quantity }, (_, i) => ({
      sectionName: `${category.label} — ${section.name}`,
      row,
      seatNumber: startSeat + i,
      price: category.priceRange.min,
    }));

    onTicketsSelected(seats, goToCheckout);
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No tickets available at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* FIFA Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
          <Trophy className="w-5 h-5 text-black" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">Select Ticket Category</h3>
          <p className="text-xs text-muted-foreground">Official FIFA World Cup 2026™ Ticketing</p>
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center justify-between bg-secondary/50 rounded-xl px-4 py-3">
        <span className="text-sm font-medium text-foreground">Number of Tickets</span>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="h-8 w-8 rounded-full border border-border"
          >
            <Minus className="w-3.5 h-3.5" />
          </Button>
          <span className="text-lg font-bold text-foreground w-6 text-center">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuantity(Math.min(8, quantity + 1))}
            className="h-8 w-8 rounded-full border border-border"
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Category Cards */}
      <div className="space-y-3">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const totalPrice = cat.priceRange.min * quantity;

          return (
            <div
              key={cat.id}
              className={cn(
                'rounded-xl border-2 overflow-hidden transition-all cursor-pointer',
                isSelected ? cat.borderColor + ' shadow-lg' : 'border-border hover:border-muted-foreground/30',
                cat.bgColor
              )}
              onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
            >
              {/* Category Header */}
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={cn('px-2.5 py-1 rounded-md text-xs font-bold text-white', cat.badgeColor)}>
                    {cat.label}
                  </span>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{cat.name}</h4>
                    <p className="text-xs text-muted-foreground">{cat.description}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-lg font-bold text-foreground">
                    {formatPrice(cat.priceRange.min)}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase">per ticket</p>
                </div>
              </div>

              {/* Expanded Details */}
              {isSelected && (
                <div className="px-4 pb-4 pt-1 border-t border-border/50 animate-fade-in space-y-3">
                  {/* Info Row */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Ticket className="w-3.5 h-3.5" />
                      {cat.totalAvailable} available
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {cat.sections.length} section{cat.sections.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Price Summary */}
                  <div className="bg-background/50 rounded-lg px-3 py-2.5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {quantity} ticket{quantity > 1 ? 's' : ''} × {formatPrice(cat.priceRange.min)}
                      </p>
                      {quantity > 1 && (
                        <p className="text-[10px] text-success flex items-center gap-1 mt-0.5">
                          ✓ Guaranteed seated together
                        </p>
                      )}
                    </div>
                    <p className="text-xl font-bold text-accent">{formatPrice(totalPrice)}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePurchase(cat, false);
                      }}
                      variant="outline"
                      className="flex-1 h-11"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePurchase(cat, true);
                      }}
                      className="flex-1 h-11 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Buy Now
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Trust Badges */}
      <div className="flex justify-center gap-5 pt-2 pb-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Shield className="w-3.5 h-3.5 text-success" />
          <span>FIFA Guarantee</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Ticket className="w-3.5 h-3.5 text-primary" />
          <span>Mobile Entry</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Trophy className="w-3.5 h-3.5 text-yellow-500" />
          <span>Official Tickets</span>
        </div>
      </div>
    </div>
  );
}

// Export the classifier for use by the map component
export { classifySections };
