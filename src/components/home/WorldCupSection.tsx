import { Link } from 'react-router-dom';
import { Trophy, ChevronRight, Calendar, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorldCupEvents } from '@/hooks/useDbEvents';
import { formatDate, formatPrice } from '@/data/events';

export function WorldCupSection() {
  const { data: events, isLoading } = useWorldCupEvents();
  
  // Show first 6 featured matches
  const featuredMatches = events
    ?.filter(e => e.is_featured)
    ?.slice(0, 6) || [];

  return (
    <section className="py-8 lg:py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920')] bg-cover bg-center opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      
      <div className="absolute top-0 left-10 w-24 h-24 bg-yellow-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 items-center justify-center shadow-lg shadow-yellow-500/30">
              <Trophy className="w-7 h-7 text-black" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <Trophy className="w-4 h-4 text-yellow-400 sm:hidden" />
                <span className="text-yellow-400 font-semibold text-xs uppercase tracking-wider">
                  {events?.length || 0} Matches Available
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                FIFA World Cup 2026™
              </h2>
              <p className="text-emerald-200/70 text-sm mt-1 hidden sm:block">
                The biggest sporting event comes to North America
              </p>
            </div>
          </div>

          <Link to="/events/sports?search=world%20cup">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold px-6 sm:px-8 shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all group"
            >
              <Trophy className="w-5 h-5 mr-2" />
              View All Matches
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Featured Matches Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
          </div>
        ) : featuredMatches.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {featuredMatches.map((match) => (
              <Link 
                key={match.id} 
                to={`/match/${match.id}`}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-emerald-300/70">
                    Match {match.match_number} · {match.round}
                    {match.group_name ? ` · Group ${match.group_name}` : ''}
                  </span>
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">
                  {match.home_team} vs {match.away_team}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-emerald-200/60">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(match.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {match.venue_name.length > 20 ? match.venue_name.slice(0, 20) + '…' : match.venue_name}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-yellow-400">
                    From {formatPrice(match.min_price)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
