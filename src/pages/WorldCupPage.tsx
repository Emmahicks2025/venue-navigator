import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, MapPin, Loader2, Search, X } from 'lucide-react';
import { MatchTeams } from '@/components/venue/MatchTeams';
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
                  className="group animate-slide-up rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-slate-700/60 via-slate-700/40 to-emerald-900/30 p-5 hover:shadow-xl hover:shadow-emerald-500/15 hover:border-emerald-400/50 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {match.group_name ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#02B906] text-white uppercase tracking-wider shadow-sm shadow-[#02B906]/30">
                          Group {match.group_name}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-gradient-to-r from-[#FFDB00] to-[#FFB800] text-black uppercase tracking-wider shadow-sm shadow-yellow-500/30">
                          {match.round}
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground font-medium">
                        Match {match.match_number}
                      </span>
                    </div>
                    {match.is_featured && (
                      <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider">
                        ⭐ Featured
                      </span>
                    )}
                  </div>

                  {/* Teams */}
                  <div className="py-3 px-2 mb-4 rounded-xl bg-slate-600/30 border border-slate-500/30">
                    <MatchTeams homeTeam={match.home_team} awayTeam={match.away_team} size="md" className="text-foreground group-hover:text-emerald-400 transition-colors" />
                  </div>

                  {/* Footer */}
                  <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-1.5">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500/70" />
                        {formatDate(match.date)}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500/70" />
                        {match.venue_name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">From</p>
                      <p className="text-base font-bold text-emerald-400">
                        {formatPrice(match.min_price)}
                      </p>
                    </div>
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
