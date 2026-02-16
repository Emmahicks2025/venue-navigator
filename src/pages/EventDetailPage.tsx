import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Share2, Heart, ChevronLeft, Info, Shield, Ticket, Loader2, Trophy } from 'lucide-react';
import { FifaTicketDisclosure } from '@/components/venue/FifaTicketDisclosure';
import { Layout } from '@/components/layout/Layout';
import { InteractiveSVGMap } from '@/components/venue/InteractiveSVGMap';
import { TicketList } from '@/components/venue/TicketList';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/context/CartContext';
import { useEventById } from '@/hooks/useDbEvents';
import { useVenueSVG } from '@/hooks/useVenueSVG';
import { useTicketmasterImage } from '@/hooks/useTicketmasterImage';
import { parseSVGSections } from '@/lib/svgParser';
import { SelectedSeat, VenueSection } from '@/types';
import { toast } from 'sonner';
import { getPriceCategory } from '@/lib/svgParser';
import { MatchTeams } from '@/components/venue/MatchTeams';
import { formatDate, formatTime, formatPrice, getCategoryLabel } from '@/data/events';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [pendingTickets, setPendingTickets] = useState<{ seats: SelectedSeat[]; goToCheckout: boolean } | null>(null);

  const { data: event, isLoading: eventLoading } = useEventById(id);
  
  // Use per-event SVG copy if available (has baked-in pricing), otherwise shared venue SVG
  const hasEventSvg = !!event?.event_svg_content;
  const svgMapName = event?.svg_map_name || undefined;
  const { svgContent: sharedSvgContent, sections: sharedSections, loading: svgLoading, error: svgError, isFallback } = useVenueSVG(
    hasEventSvg ? undefined : svgMapName
  );

  // If event has its own SVG copy, parse sections from it
  const svgContent = hasEventSvg ? event.event_svg_content : sharedSvgContent;
  const svgSections = useMemo(() => {
    if (hasEventSvg && event?.event_svg_content) {
      return parseSVGSections(event.event_svg_content);
    }
    return sharedSections;
  }, [hasEventSvg, event?.event_svg_content, sharedSections]);
  
  // Fetch performer image from Ticketmaster if needed
  const { imageUrl: performerImageUrl } = useTicketmasterImage(
    event?.performer || '',
    event?.performer_image || undefined,
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

  const isWorldCup = event?.name?.toLowerCase().includes('world cup') ?? false;

  const commitTickets = useCallback((seats: SelectedSeat[], goToCheckout: boolean) => {
    if (!event) return;
    addToCart({
      eventId: event.id,
      eventName: event.name,
      eventDate: event.date,
      venueName: event.venue_name,
      performer: event.performer,
      performerImage: event.performer_image || '',
      seats,
    });
    toast.success(`${seats.length} ticket${seats.length > 1 ? 's' : ''} added to cart!`);
    setSelectedSection(null);
    if (goToCheckout) navigate('/checkout');
  }, [event, addToCart, navigate]);

  if (eventLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading event details...</p>
        </div>
      </Layout>
    );
  }

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
    if (isWorldCup) {
      setPendingTickets({ seats, goToCheckout });
    } else {
      commitTickets(seats, goToCheckout);
    }
  };

  const handleDisclosureAccept = () => {
    if (pendingTickets) {
      commitTickets(pendingTickets.seats, pendingTickets.goToCheckout);
      setPendingTickets(null);
    }
  };

  const handleCloseTickets = () => {
    setSelectedSection(null);
  };

  return (
    <Layout>
      {/* Compact Hero Banner */}
      <section className="relative h-[30vh] lg:h-[35vh] overflow-hidden">
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

      {/* Event Info - Compact Card */}
      <section className="relative -mt-16 pb-4">
        <div className="container mx-auto px-4">
          <div className="bg-card border border-border rounded-2xl p-4 lg:p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                {isWorldCup && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded-full mb-2">
                    <Trophy className="w-3 h-3" />
                    FIFA World Cup 2026
                  </span>
                )}
                {!isWorldCup && (
                  <span className="inline-block px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full mb-2">
                    {getCategoryLabel(event.category)}
                  </span>
                )}
                {event.round && (
                  <span className="inline-block px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full mb-2 ml-2">
                    {event.round}{event.group_name ? ` - Group ${event.group_name}` : ''}
                  </span>
                )}
                {event.home_team && event.away_team ? (
                  <MatchTeams homeTeam={event.home_team} awayTeam={event.away_team} size="lg" className="text-foreground mb-1" />
                ) : (
                  <h1 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-1">
                    {event.name}
                  </h1>
                )}
                <p className="text-muted-foreground">{event.description || event.performer}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Starting from</p>
                <p className="text-xl font-bold text-accent">{formatPrice(event.min_price)}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">{formatTime(event.time)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">
                  {event.venue_name} · {event.venue_city}{event.venue_state ? `, ${event.venue_state}` : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Map */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div className="bg-card border border-border rounded-2xl p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-foreground">Select Your Seats</h2>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-primary" />
                  <span className="text-muted-foreground">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-muted" />
                  <span className="text-muted-foreground">Not Available</span>
                </div>
              </div>
            </div>
            
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
              </div>
            ) : (
              <>
                {isFallback && (
                  <div className="mb-3 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-xs text-muted-foreground">
                      <Info className="w-3.5 h-3.5" />
                      Generic stadium layout — actual sections may vary
                    </span>
                  </div>
                )}
                <InteractiveSVGMap
                  svgContent={svgContent}
                  sections={svgSections}
                  selectedSection={selectedSection}
                  onSectionSelect={setSelectedSection}
                />
              </>
            )}

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                👆 Tap on a section to view available tickets
              </p>
            </div>

            <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5 text-success" />
                <span>Buyer Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Ticket className="w-3.5 h-3.5 text-primary" />
                <span>Mobile Tickets</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="w-3.5 h-3.5 text-accent" />
                <span>Instant Confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Sheet for Tickets */}
      <Sheet open={!!selectedSection} onOpenChange={(open) => !open && handleCloseTickets()}>
        <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Select Tickets</SheetTitle>
          </SheetHeader>
          
          {selectedSectionData && selectedSVGSection && (
            <TicketList
              section={{
                ...selectedSectionData,
                basePrice: selectedSVGSection.currentPrice,
              }}
              svgSection={selectedSVGSection}
              onTicketsSelected={handleSeatsSelected}
              onClose={handleCloseTickets}
              matchCategory={{
                round: event.round,
                groupName: event.group_name,
                matchNumber: event.match_number,
                isWorldCup,
              }}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* FIFA World Cup Ticket Disclosure */}
      <FifaTicketDisclosure
        open={!!pendingTickets}
        onAccept={handleDisclosureAccept}
        onCancel={() => setPendingTickets(null)}
      />
    </Layout>
  );
};

export default EventDetailPage;
