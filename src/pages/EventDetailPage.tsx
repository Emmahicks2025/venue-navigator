import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Share2, Heart, ChevronLeft, Info, Shield, Ticket } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { VenueMap } from '@/components/venue/VenueMap';
import { SeatSelector } from '@/components/venue/SeatSelector';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { getEventById, getVenueById, formatDate, formatTime, formatPrice, getCategoryLabel } from '@/data/events';
import { SelectedSeat } from '@/types';
import { toast } from 'sonner';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const event = getEventById(id || '');
  const venue = event ? getVenueById(event.venueId) : undefined;

  if (!event || !venue) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Event Not Found</h1>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </Layout>
    );
  }

  const selectedSectionData = venue.sections.find(s => s.id === selectedSection);

  const handleSeatsSelected = (seats: SelectedSeat[]) => {
    addToCart({
      eventId: event.id,
      eventName: event.name,
      eventDate: event.date,
      venueName: event.venueName,
      seats,
    });
    toast.success(`${seats.length} ticket${seats.length > 1 ? 's' : ''} added to cart!`);
    setSelectedSection(null);
  };

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative h-[40vh] lg:h-[50vh] overflow-hidden">
        <img
          src={event.performerImage}
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
                      <p className="font-medium text-foreground">{venue.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Venue Map */}
              <div className="bg-card border border-border rounded-2xl p-6 lg:p-8">
                <h2 className="font-display text-xl font-bold text-foreground mb-6">Select Your Seats</h2>
                
                {selectedSectionData ? (
                  <SeatSelector
                    section={selectedSectionData}
                    onSeatsSelected={handleSeatsSelected}
                    onClose={() => setSelectedSection(null)}
                  />
                ) : (
                  <VenueMap
                    sections={venue.sections}
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

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Pricing Summary */}
              <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                <h3 className="font-display text-lg font-bold text-foreground mb-4">Ticket Prices</h3>
                <div className="space-y-3">
                  {venue.sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSection(section.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                        selectedSection === section.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-medium text-foreground text-sm">{section.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{section.priceCategory}</p>
                      </div>
                      <p className="font-bold text-accent">{formatPrice(section.basePrice)}</p>
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-border space-y-3">
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
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EventDetailPage;
