import { Link } from 'react-router-dom';
import { Trophy, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWorldCupEvents } from '@/data/eventsData';
import { formatShortDate, formatPrice } from '@/data/events';

export function WorldCupSection() {
  const worldCupEvents = getWorldCupEvents();
  
  if (worldCupEvents.length === 0) return null;

  return (
    <section className="py-12 lg:py-20 relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80" />
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30 mb-4">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">Official Tickets</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            FIFA World Cup 2026™
          </h2>
          <p className="text-emerald-200/80 text-lg max-w-2xl mx-auto">
            The biggest sporting event comes to North America. Secure your seats for history.
          </p>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
          {worldCupEvents.slice(0, 6).map((event) => {
            const dateInfo = formatShortDate(event.date);
            return (
              <Link
                key={event.id}
                to={`/event/${event.id}`}
                className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10"
              >
                {/* Card Content */}
                <div className="p-5">
                  <div className="flex gap-4">
                    {/* Date Badge */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex flex-col items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                      <span className="text-xs font-bold uppercase tracking-wider">{dateInfo.month}</span>
                      <span className="text-2xl font-bold leading-none">{dateInfo.day}</span>
                    </div>
                    
                    {/* Event Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-lg leading-tight mb-1 group-hover:text-emerald-300 transition-colors truncate">
                        {event.name}
                      </h3>
                      <p className="text-emerald-200/60 text-sm mb-2 truncate">{event.performer}</p>
                      <div className="flex items-center gap-1 text-emerald-300/80 text-sm">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{event.venueName}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <div>
                      <span className="text-emerald-300/60 text-xs">From</span>
                      <p className="text-white font-bold text-lg">{formatPrice(event.minPrice)}</p>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium group-hover:gap-2 transition-all">
                      Get Tickets
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/events/sports?search=world%20cup">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold px-8 shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all"
            >
              <Trophy className="w-5 h-5 mr-2" />
              View All World Cup Matches
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
