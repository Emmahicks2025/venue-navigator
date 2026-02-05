import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { Event } from '@/types';
import { formatShortDate, formatDate, formatTime, formatPrice } from '@/data/events';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTicketmasterImage } from '@/hooks/useTicketmasterImage';

interface EventCardProps {
  event: Event;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export const EventCard = ({ event, variant = 'default', className }: EventCardProps) => {
  const { month, day } = formatShortDate(event.date);
  const { imageUrl } = useTicketmasterImage(event.performer, event.performerImage, event.category);

  if (variant === 'compact') {
    return (
      <Link
        to={`/event/${event.id}`}
        className={cn(
          'flex items-center gap-4 p-4 rounded-xl bg-card border border-border card-hover group',
          className
        )}
      >
        <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold text-primary uppercase">{month}</span>
          <span className="text-lg font-bold text-foreground leading-none">{day}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {event.performer}
          </h4>
          <p className="text-sm text-muted-foreground truncate">{event.venueName}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-accent">From {formatPrice(event.minPrice)}</p>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link
        to={`/event/${event.id}`}
        className={cn(
          'group relative overflow-hidden rounded-2xl bg-card border border-border card-hover block',
          className
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={event.performer}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          
          {/* Date Badge */}
          <div className="date-badge">
            {month} {day}
          </div>

          {/* View Tickets Button */}
          <div className="absolute bottom-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <Button size="sm" className="bg-primary hover:bg-primary/90 btn-glow">
              View Tickets
            </Button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-display font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {event.performer}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{event.venueName}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(event.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(event.time)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link
      to={`/event/${event.id}`}
      className={cn(
        'group relative overflow-hidden rounded-xl bg-card border border-border card-hover block',
        className
      )}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative sm:w-48 aspect-video sm:aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={event.performer}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="date-badge">
            {month} {day}
          </div>
        </div>

        <div className="flex-1 p-4 flex flex-col">
          <h3 className="font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {event.name}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{event.venueName}</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(event.time)}
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Starting from</p>
              <p className="text-lg font-bold text-accent">{formatPrice(event.minPrice)}</p>
            </div>
            <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              Get Tickets
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};
