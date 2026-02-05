import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Share2, Heart, ChevronLeft, Info, Shield, Ticket, Loader2, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { InteractiveSVGMap } from '@/components/venue/InteractiveSVGMap';
import { TicketList } from '@/components/venue/TicketList';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { getEventById, getVenueByName, formatDate, formatTime, formatPrice, getCategoryLabel } from '@/data/events';
import { useVenueSVG } from '@/hooks/useVenueSVG';
import { useTicketmasterImage } from '@/hooks/useTicketmasterImage';
import { SelectedSeat, VenueSection } from '@/types';
import { toast } from 'sonner';
import { getPriceCategory } from '@/lib/svgParser';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const event = getEventById(id || '');
  const venue = event ? getVenueByName(event.venueName) : undefined;
  
  // Load SVG map for the venue - always call hooks unconditionally
  const { svgContent, sections: svgSections, loading: svgLoading, error: svgError } = useVenueSVG(
    venue?.svgMapId
  );
  
  // Fetch performer image from Ticketmaster if needed
  const { imageUrl: performerImageUrl } = useTicketmasterImage(
    event?.performer || '',
    event?.performerImage,
    event?.category || 'concerts'
  );

  // Convert SVG sections to venue sections format
  const venueSections: VenueSection[] = useMemo(() => {
    if (svgSections.length === 0) return [];
    
    const allPrices = svgSections.map(s => s.currentPrice);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    
    return svgSections.map(section => ({
      id: section.id,
      name: section.name,
      rows: section.rows,
      seatsPerRow: section.seatsPerRow,
      priceCategory: getPriceCategory(section.currentPrice, minPrice, maxPrice),
      basePrice: section.currentPrice,
    }));
  }, [svgSections]);

  // Get top sections for the pricing sidebar (sorted by price, limit 8)
  const topSections = useMemo(() => {
    return [...venueSections]
      .sort((a, b) => b.basePrice - a.basePrice)
      .slice(0, 8);
  }, [venueSections]);

  if (!event) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Event Not Found</h1>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </Layout>
    );
  }

  const selectedSectionData = venueSections.find(s => s.id === selectedSection);
  const selectedSVGSection = svgSections.find(s => s.id === selectedSection);

  const handleSeatsSelected = (seats: SelectedSeat[], goToCheckout: boolean = false) => {
    addToCart({
      eventId: event.id,
      eventName: event.name,
      eventDate: event.date,
      venueName: event.venueName,
      seats,
    });
    toast.success(`${seats.length} ticket${seats.length > 1 ? 's' : ''} added to cart!`);
    setSelectedSection(null);
    
    if (goToCheckout) {
      navigate('/checkout');
    }
  };

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative h-[40vh] lg:h-[50vh] overflow-hidden">
        <img
          src={performerImageUrl}
          alt={event.performer}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        {/* Back Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 glass rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="ghost" size="icon" className="glass rounded-full">
            <Share2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="glass rounded-full">
            <Heart className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Event Info */}
      <section className="relative -mt-24 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Header */}
              <div className="bg-card border border-border rounded-2xl p-6 lg:p-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-3">
                      {getCategoryLabel(event.category)}
                    </span>
                    <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
                      {event.name}
                    </h1>
                    <p className="text-lg text-muted-foreground">{event.performer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Starting from</p>
                    <p className="text-2xl font-bold text-accent">{formatPrice(event.minPrice)}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="font-medium text-foreground">{formatDate(event.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="font-medium text-foreground">{formatTime(event.time)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Venue</p>
                      <p className="font-medium text-foreground">{event.venueName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Venue Map - Always Visible */}
              <div className="bg-card border border-border rounded-2xl p-6 lg:p-8">
                <h2 className="font-display text-xl font-bold text-foreground mb-6">Select Your Seats</h2>
                
                {svgLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                    <p className="text-muted-foreground">Loading venue map...</p>
                  </div>
                ) : svgError || !svgContent ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      Interactive venue map not available for this venue.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Please select a section from the pricing panel.
                    </p>
                  </div>
                ) : (
                  <InteractiveSVGMap
                    svgContent={svgContent}
                    sections={svgSections}
                    selectedSection={selectedSection}
                    onSectionSelect={setSelectedSection}
                  />
                )}
              </div>

              {/* Description */}
              <div className="bg-card border border-border rounded-2xl p-6 lg:p-8">
                <h2 className="font-display text-xl font-bold text-foreground mb-4">About This Event</h2>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </div>
            </div>

            {/* Sidebar - Ticket List or Section Info */}
            <div className="space-y-4">
              {selectedSectionData && selectedSVGSection ? (
                /* Ticket List in Sidebar */
                <TicketList
                  section={{
                    ...selectedSectionData,
                    basePrice: selectedSVGSection.currentPrice,
                  }}
                  svgSection={selectedSVGSection}
                  onTicketsSelected={handleSeatsSelected}
                  onClose={() => setSelectedSection(null)}
                />
              ) : (
                /* Default Section Selection Panel */
                <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                  <h3 className="font-display text-lg font-bold text-foreground mb-4">
                    Select a Section
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Click on a section in the venue map to see available tickets and pricing.
                  </p>
                  
                  <div className="bg-secondary/50 rounded-xl p-4 mb-4">
                    <p className="text-sm font-medium text-foreground mb-2">Price Range</p>
                    <p className="text-xl font-bold text-accent">
                      {venueSections.length > 0 
                        ? `${formatPrice(Math.min(...venueSections.map(s => s.basePrice)))} - ${formatPrice(Math.max(...venueSections.map(s => s.basePrice)))}`
                        : 'Loading...'}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground mb-6">
                    {venueSections.length} sections available
                  </p>

                  <div className="pt-6 border-t border-border space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4 text-success" />
                      <span>100% Buyer Guarantee</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Ticket className="w-4 h-4 text-primary" />
                      <span>Mobile Tickets Available</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Info className="w-4 h-4 text-accent" />
                      <span>Instant Confirmation</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EventDetailPage;
