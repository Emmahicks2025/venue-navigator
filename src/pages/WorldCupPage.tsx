import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, MapPin, Loader2, Search, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { CategoryTabs } from '@/components/events/CategoryTabs';
import { useWorldCupEvents } from '@/hooks/useDbEvents';
import { formatDate, formatPrice } from '@/data/events';
import { Input } from '@/components/ui/input';

const WorldCupPage = () => {
  const { data: events, isLoading } = useWorldCupEvents();
  const [searchQuery, setSearchQuery] = useState('');

  const matches = useMemo(() => {
    const all = events || [];
    if (!searchQuery.trim()) return all;
    const q = searchQuery.toLowerCase();
    return all.filter(m =>
      (m.home_team?.toLowerCase().includes(q)) ||
      (m.away_team?.toLowerCase().includes(q)) ||
      (m.venue_name?.toLowerCase().includes(q)) ||
      (m.group_name?.toLowerCase().includes(q)) ||
      (m.round?.toLowerCase().includes(q)) ||
      (m.name?.toLowerCase().includes(q))
    );
  }, [events, searchQuery]);

  return (
    <Layout>
      {/* Header */}
      <section className="pt-8 pb-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <Trophy className="w-7 h-7 text-black" />
              </div>
              <div>
                <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
                  FIFA World Cup 2026™
                </h1>
                <p className="text-muted-foreground">
                  {matches.length} matches available
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <CategoryTabs activeCategory="world-cup" />
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="pt-6 pb-2">
        <div className="container mx-auto px-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by team, venue, group..."
              className="pl-10 pr-9 bg-secondary border-border"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Matches Grid */}
      <section className="py-6 lg:py-10">
        <div className="container mx-auto px-4">
          {searchQuery && (
            <p className="text-sm text-muted-foreground mb-4">
              {matches.length} match{matches.length !== 1 ? 'es' : ''} found for "{searchQuery}"
            </p>
          )}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : matches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {matches.map((match, index) => (
                <Link
                  key={match.id}
                  to={`/match/${match.id}`}
                  className="group animate-slide-up rounded-xl border border-border bg-card p-4 hover:shadow-lg hover:border-primary/30 transition-all"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {match.group_name ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#02B906] text-white uppercase tracking-wide">
                          Group {match.group_name}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-gradient-to-r from-[#FFDB00] to-[#FFB800] text-black uppercase tracking-wide">
                          {match.round}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        Match {match.match_number}
                      </span>
                    </div>
                    {match.is_featured && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-3 group-hover:text-primary transition-colors">
                    {match.home_team} vs {match.away_team}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(match.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {match.venue_name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      From {formatPrice(match.min_price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">No matches found</p>
              <p className="text-sm text-muted-foreground">Check back soon for new listings!</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default WorldCupPage;
