import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { EventCard } from '@/components/events/EventCard';
import { CategoryTabs } from '@/components/events/CategoryTabs';
import { Input } from '@/components/ui/input';
import { useDbEvents, mapDbEventToFrontend } from '@/hooks/useDbEvents';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: dbEvents, isLoading } = useDbEvents(debouncedQuery || undefined);
  const results = (dbEvents || []).map(mapDbEventToFrontend);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
  };

  return (
    <Layout>
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Search Events
          </h1>

          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by artist, event, venue, or city..."
              className="pl-12 py-6 text-lg bg-secondary border-border"
            />
          </form>

          <div className="mt-6">
            <CategoryTabs />
          </div>
        </div>
      </section>

      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <p className="text-muted-foreground mb-6">
            {isLoading 
              ? 'Searching...' 
              : query 
                ? `${results.length} results for "${query}"` 
                : `${results.length} events available`}
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {results.map((event, index) => (
                <div
                  key={event.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">No events found</p>
              <p className="text-sm text-muted-foreground">Try a different search term</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default SearchPage;
