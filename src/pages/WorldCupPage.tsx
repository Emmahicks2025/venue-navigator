import { Link } from 'react-router-dom';
import { Trophy, Calendar, MapPin, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { CategoryTabs } from '@/components/events/CategoryTabs';
import { useWorldCupEvents } from '@/hooks/useDbEvents';
import { formatDate, formatPrice } from '@/data/events';

const WorldCupPage = () => {
  const { data: events, isLoading } = useWorldCupEvents();

  const matches = events || [];

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

      {/* Matches Grid */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
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
                    <span className="text-xs text-muted-foreground">
                      Match {match.match_number} · {match.round}
                      {match.group_name ? ` · Group ${match.group_name}` : ''}
                    </span>
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
