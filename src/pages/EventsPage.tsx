import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { EventCard } from '@/components/events/EventCard';
import { CategoryTabs } from '@/components/events/CategoryTabs';
import { SearchBar } from '@/components/search/SearchBar';
import { getEventsByCategory, getCategoryLabel, events } from '@/data/events';

const EventsPage = () => {
  const { category } = useParams<{ category: string }>();
  const currentCategory = category || 'all';
  
  const filteredEvents = currentCategory === 'all' 
    ? events 
    : getEventsByCategory(currentCategory);

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
              <p className="text-muted-foreground">
                {filteredEvents.length} events available
              </p>
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
          {filteredEvents.length > 0 ? (
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
