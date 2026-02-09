import { Link } from 'react-router-dom';
import { Music } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { useTicketmasterImage } from '@/hooks/useTicketmasterImage';
import { Skeleton } from '@/components/ui/skeleton';

interface Artist {
  name: string;
  genre: string;
  searchQuery: string;
}

const topArtists: Artist[] = [
  { name: 'Taylor Swift', genre: 'Pop', searchQuery: 'Taylor Swift' },
  { name: 'Lady Gaga', genre: 'Pop / Dance', searchQuery: 'Lady Gaga' },
  { name: 'Bruno Mars', genre: 'Pop / R&B', searchQuery: 'Bruno Mars' },
  { name: 'Drake', genre: 'Hip-Hop', searchQuery: 'Drake' },
  { name: 'Beyoncé', genre: 'R&B / Pop', searchQuery: 'Beyoncé' },
  { name: 'The Weeknd', genre: 'R&B / Pop', searchQuery: 'The Weeknd' },
  { name: 'Kendrick Lamar', genre: 'Hip-Hop', searchQuery: 'Kendrick Lamar' },
  { name: 'Morgan Wallen', genre: 'Country', searchQuery: 'Morgan Wallen' },
  { name: 'Billie Eilish', genre: 'Alt-Pop', searchQuery: 'Billie Eilish' },
  { name: 'Bad Bunny', genre: 'Reggaeton', searchQuery: 'Bad Bunny' },
];

// Artist card component that fetches real image from Ticketmaster
const ArtistCard = ({ artist }: { artist: Artist }) => {
  const { imageUrl, isLoading } = useTicketmasterImage(artist.name, undefined, 'concerts');

  return (
    <Link
      to={`/search?q=${encodeURIComponent(artist.searchQuery)}`}
      className="group block text-center"
    >
      <div className="relative w-full aspect-square rounded-full overflow-hidden mb-3 ring-2 ring-transparent group-hover:ring-primary transition-all duration-300 shadow-lg group-hover:shadow-primary/25">
        {isLoading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <img
            src={imageUrl}
            alt={artist.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <h3 className="font-display font-bold text-sm lg:text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
        {artist.name}
      </h3>
      <p className="text-xs text-muted-foreground">{artist.genre}</p>
    </Link>
  );
};

export const TopArtistsSection = () => {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Music className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Top Artists</h2>
              <p className="text-sm text-muted-foreground">Trending artists in the USA right now</p>
            </div>
          </div>
          <Link to="/events/concerts" className="text-sm text-primary hover:underline hidden sm:block">
            View All →
          </Link>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-3">
            {topArtists.map((artist) => (
              <CarouselItem key={artist.name} className="pl-2 md:pl-3 basis-1/3 sm:basis-1/4 lg:basis-1/5">
                <ArtistCard artist={artist} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex -left-4 lg:-left-12" />
          <CarouselNext className="hidden sm:flex -right-4 lg:-right-12" />
        </Carousel>
      </div>
    </section>
  );
};
