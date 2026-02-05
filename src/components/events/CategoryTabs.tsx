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
  return (
    <div className={cn('flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide', className)}>
      {categoryConfig.map(({ id, icon: Icon, color }) => {
        const isActive = activeCategory === id;
        return (
          <Link
            key={id}
            to={`/events/${id}`}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300',
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
  );
};
