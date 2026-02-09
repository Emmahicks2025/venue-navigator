import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { EventCard } from '@/components/events/EventCard';
import { CategoryTabs } from '@/components/events/CategoryTabs';
import { SearchBar } from '@/components/search/SearchBar';
import { getCategoryLabel } from '@/data/events';
import { useDbEventsByCategory, mapDbEventToFrontend } from '@/hooks/useDbEvents';

const EventsPage = () => {
  const { category } = useParams<{ category: string }>();
  const currentCategory = category || 'all';
  
  const { data: dbEvents, isLoading } = useDbEventsByCategory(currentCategory);
  const filteredEvents = (dbEvents || []).map(mapDbEventToFrontend);

  return (
    <Layout>
      {/* Header */}
      <section className="pt-8 pb-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">
                {currentCategory === 'all' ? 'All Events' : getCategoryLabel(currentCategory)}
              </h1>
            </div>
            <SearchBar className="w-full lg:w-80" />
          </div>

          <div className="mt-6">
            <CategoryTabs activeCategory={currentCategory} />
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredEvents.map((event, index) => (
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
              <p className="text-xl text-muted-foreground mb-4">No events found in this category</p>
              <p className="text-sm text-muted-foreground">Check back soon for new listings!</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default EventsPage;
