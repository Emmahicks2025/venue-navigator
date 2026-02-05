import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { EventCategory } from '@/types';
import { getCategoryLabel } from '@/data/events';
import { cn } from '@/lib/utils';
import { Music, Trophy, Theater, Laugh, PartyPopper } from 'lucide-react';

interface CategoryTabsProps {
  activeCategory?: string;
  className?: string;
}

const categoryConfig: { id: EventCategory | 'all'; icon: React.ElementType; color: string }[] = [
  { id: 'concerts', icon: Music, color: 'from-blue-500 to-purple-500' },
  { id: 'sports', icon: Trophy, color: 'from-green-500 to-emerald-500' },
  { id: 'theater', icon: Theater, color: 'from-pink-500 to-rose-500' },
  { id: 'comedy', icon: Laugh, color: 'from-yellow-500 to-orange-500' },
  { id: 'festivals', icon: PartyPopper, color: 'from-purple-500 to-pink-500' },
];

export const CategoryTabs = ({ activeCategory, className }: CategoryTabsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cn('relative', className)}>
      {/* Fade edges to hint scrollability */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-background to-transparent z-10 sm:hidden" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-background to-transparent z-10 sm:hidden" />

      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {categoryConfig.slice(0, 2).map(({ id, icon: Icon, color }) => {
          const isActive = activeCategory === id;
          return (
            <Link
              key={id}
              to={`/events/${id}`}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 snap-start shrink-0',
                isActive
                  ? `bg-gradient-to-r ${color} text-white shadow-lg`
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              )}
            >
              <Icon className="w-4 h-4" />
              {getCategoryLabel(id)}
            </Link>
          );
        })}

        {/* FIFA World Cup Tab */}
        <Link
          to="/events/world-cup"
          className={cn(
            'flex items-center gap-1.5 px-4 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 snap-start shrink-0',
            activeCategory === 'world-cup'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
              : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
          )}
        >
          <Trophy className="w-4 h-4" />
          FIFA World Cup
        </Link>

        {categoryConfig.slice(2).map(({ id, icon: Icon, color }) => {
          const isActive = activeCategory === id;
          return (
            <Link
              key={id}
              to={`/events/${id}`}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 snap-start shrink-0',
                isActive
                  ? `bg-gradient-to-r ${color} text-white shadow-lg`
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              )}
            >
              <Icon className="w-4 h-4" />
              {getCategoryLabel(id)}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
