import { Link } from 'react-router-dom';
import { MapPin, Calendar, Sparkles, Loader2, DollarSign, ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SearchBar } from '@/components/search/SearchBar';
import { EventCard } from '@/components/events/EventCard';
import { CategoryTabs } from '@/components/events/CategoryTabs';
import { TopArtistsSection } from '@/components/home/TopArtistsSection';
import { HeroParticles } from '@/components/home/HeroParticles';
import { useScrollReveal } from '@/hooks/useScrollReveal';

import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

import { formatPrice } from '@/data/events';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useFeaturedDbEvents, useDbEventsByCategory, useDbEventsByCity, useDbCategoryCounts, mapDbEventToFrontend } from '@/hooks/useDbEvents';
import heroImage from '@/assets/hero-stadium.jpg';
import categoryConcerts from '@/assets/category-concerts.jpg';
import categorySports from '@/assets/category-sports.jpg';
import categoryTheater from '@/assets/category-theater.jpg';
import categoryComedy from '@/assets/category-comedy.jpg';

const Index = () => {
  const heroRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        if (rect.bottom > 0) {
          setScrollY(window.scrollY);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { location, loading: locationLoading } = useUserLocation();

  const { data: featuredDbEvents, isLoading: featuredLoading } = useFeaturedDbEvents();
  const { data: allDbEvents } = useDbEventsByCategory('all');
  const { data: localDbEvents } = useDbEventsByCity(location?.city);
  const { data: categoryCounts } = useDbCategoryCounts();

  const featuredEvents = (featuredDbEvents || []).map(mapDbEventToFrontend);
  const allEvents = (allDbEvents || []).map(mapDbEventToFrontend);
  const localEvents = (localDbEvents || []).map(mapDbEventToFrontend);

  const hasLocalEvents = localEvents.length > 0;
  const upcomingEvents = hasLocalEvents ? localEvents.slice(0, 6) : allEvents.slice(0, 6);

  const featuredReveal = useScrollReveal(0.1);
  const upcomingReveal = useScrollReveal(0.1);

  const getCategoryCount = (cat: string) => categoryCounts?.[cat] || 0;

  return (
    <Layout>
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-24 pb-14 sm:pt-28 sm:pb-18 lg:pt-36 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Concert stadium"
            className="w-full h-full object-cover scale-110"
            style={{ transform: `scale(1.1) translateY(${scrollY * 0.3}px)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
        </div>

        <HeroParticles />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="animate-slide-up">
            <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-primary font-semibold mb-4 drop-shadow-lg">
              ✦ Your Premium Ticket Destination ✦
            </p>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-3 tracking-tight leading-[0.9]">
              <span className="text-foreground drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">Experience It</span>
              <br />
              <span className="text-gradient-primary italic drop-shadow-[0_2px_20px_rgba(59,130,246,0.4)]">Live</span>
            </h1>
            <p className="text-sm sm:text-base text-foreground/80 mb-8 max-w-lg mx-auto leading-relaxed drop-shadow-md">
              Discover and book tickets to the hottest concerts, sports events, theater shows, and more.
            </p>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <SearchBar variant="hero" className="mb-8" />
          </div>

          <div className="animate-slide-up w-full overflow-hidden" style={{ animationDelay: '0.2s' }}>
            <CategoryTabs />
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Sell Tickets CTA Banner */}
      <section className="py-6 lg:py-8">
        <div className="container mx-auto px-4">
          <Link to="/sell" className="block group">
            <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-accent/20 via-accent/10 to-primary/20 border border-accent/30 hover:border-accent/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-primary/5 group-hover:from-accent/10 group-hover:to-primary/10 transition-all duration-300" />
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                    <DollarSign className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">Got Tickets to Sell?</h3>
                    <p className="text-sm text-muted-foreground">List your tickets in minutes. Secure payment, verified delivery, zero upfront fees.</p>
                  </div>
                </div>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold gap-2 btn-accent-glow shrink-0 px-6">
                  Sell Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Top Artists */}
      <TopArtistsSection />

      {/* Featured Events Carousel */}
      <section
        ref={featuredReveal.ref as React.RefObject<HTMLElement>}
        className={`py-12 lg:py-16 transition-all duration-700 ${featuredReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Featured Events</h2>
                <p className="text-sm text-muted-foreground">Don't miss these trending experiences</p>
              </div>
            </div>
          </div>

          {featuredLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : featuredEvents.length > 0 ? (
            <Carousel
              opts={{ align: "start", loop: true }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {featuredEvents.map((event) => (
                  <CarouselItem key={event.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <EventCard event={event} variant="featured" />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex -left-4 lg:-left-12" />
              <CarouselNext className="hidden sm:flex -right-4 lg:-right-12" />
            </Carousel>
          ) : (
            <p className="text-center text-muted-foreground py-8">No featured events yet</p>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      <section
        ref={upcomingReveal.ref as React.RefObject<HTMLElement>}
        className={`py-16 lg:py-24 bg-card/50 transition-all duration-700 delay-100 ${upcomingReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                {hasLocalEvents ? (
                  <MapPin className="w-5 h-5 text-primary" />
                ) : (
                  <Calendar className="w-5 h-5 text-primary" />
                )}
              </div>
              <div>
                <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                  {hasLocalEvents ? `Events in ${location?.city}` : 'Upcoming Events'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {hasLocalEvents 
                    ? `${localEvents.length} events near you` 
                    : 'Secure your tickets before they sell out'}
                </p>
              </div>
            </div>
            <Link to="/events/all">
              <Button variant="outline" className="hidden sm:flex">
                View All Events
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcomingEvents.map((event, index) => (
              <div key={event.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <EventCard event={event} />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link to="/events/all">
              <Button variant="outline" className="w-full">View All Events</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">Browse by Category</h2>
            <p className="text-muted-foreground">Find your perfect live experience</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Concerts', image: categoryConcerts, href: '/events/concerts' },
              { name: 'Sports', image: categorySports, href: '/events/sports' },
              { name: 'Theater', image: categoryTheater, href: '/events/theater' },
              { name: 'Comedy', image: categoryComedy, href: '/events/comedy' },
            ].map((cat) => (
              <Link
                key={cat.name}
                to={cat.href}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3] card-hover"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                  <h3 className="font-display text-xl lg:text-2xl font-bold text-white drop-shadow-lg">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats/Trust Section */}
      <section className="py-16 lg:py-24 bg-card/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '45K+', label: 'Tickets Sold' },
              { value: '1,200+', label: 'Events Listed' },
              { value: '100%', label: 'Secure Checkout' },
              { value: '24/7', label: 'Customer Support' },
            ].map((stat) => (
              <div key={stat.label} className="space-y-2">
                <p className="font-display text-3xl lg:text-4xl font-bold text-gradient-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl p-8 lg:p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20" />
            <div className="absolute inset-0 section-glow" />
            <div className="relative z-10">
              <h2 className="font-display text-2xl lg:text-4xl font-bold text-foreground mb-4">
                Never Miss a Show
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Get early access to presales, exclusive discounts, and alerts for your favorite artists.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 btn-accent-glow">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
