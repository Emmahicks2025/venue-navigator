import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EventCategory } from '@/types';
import { getCategoryLabel } from '@/data/events';
import { cn } from '@/lib/utils';
import { Music, Trophy, Theater, Laugh, PartyPopper, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -150 : 150, behavior: 'smooth' });
  };

  const tabBase = 'flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-xs whitespace-nowrap transition-all duration-300 snap-start shrink-0';

  return (
    <div className={cn('relative', className)}>
      {/* Left arrow indicator */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-20 flex items-center pl-0.5 pr-2 bg-gradient-to-r from-background via-background/80 to-transparent"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
      )}

      {/* Right arrow indicator */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-20 flex items-center pr-0.5 pl-2 bg-gradient-to-l from-background via-background/80 to-transparent"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex items-center gap-1.5 overflow-x-auto pb-1.5 snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x',
          overscrollBehaviorX: 'contain',
        }}
      >
        {categoryConfig.slice(0, 2).map(({ id, icon: Icon, color }) => {
          const isActive = activeCategory === id;
          return (
            <Link
              key={id}
              to={`/events/${id}`}
              className={cn(
                tabBase,
                isActive
                  ? `bg-gradient-to-r ${color} text-white shadow-lg`
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {getCategoryLabel(id)}
            </Link>
          );
        })}

        {/* FIFA World Cup Tab - Prominent */}
        <Link
          to="/events/world-cup"
          className={cn(
            tabBase,
            'font-bold ring-1.5 ring-offset-1 ring-offset-background',
            activeCategory === 'world-cup'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/40 ring-emerald-400'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25 ring-yellow-400/60 hover:shadow-lg hover:shadow-emerald-500/40 animate-glow-pulse'
          )}
        >
          <Trophy className="w-3.5 h-3.5 text-yellow-300" />
          FIFA World Cup
          <span className="ml-0.5 text-[8px] font-semibold bg-yellow-400 text-black px-1 py-px rounded-full leading-none">2026</span>
        </Link>

        {categoryConfig.slice(2).map(({ id, icon: Icon, color }) => {
          const isActive = activeCategory === id;
          return (
            <Link
              key={id}
              to={`/events/${id}`}
              className={cn(
                tabBase,
                isActive
                  ? `bg-gradient-to-r ${color} text-white shadow-lg`
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {getCategoryLabel(id)}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
