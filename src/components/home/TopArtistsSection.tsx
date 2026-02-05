import { Link } from 'react-router-dom';
import { Music } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

interface Artist {
  name: string;
  image: string;
  genre: string;
  searchQuery: string;
}

const topArtists: Artist[] = [
  {
    name: 'Taylor Swift',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&h=600&fit=crop&crop=faces',
    genre: 'Pop',
    searchQuery: 'Taylor Swift',
  },
  {
    name: 'Lady Gaga',
    image: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=600&h=600&fit=crop&crop=faces',
    genre: 'Pop / Dance',
    searchQuery: 'Lady Gaga',
  },
  {
    name: 'Bruno Mars',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&h=600&fit=crop&crop=faces',
    genre: 'Pop / R&B',
    searchQuery: 'Bruno Mars',
  },
  {
    name: 'Drake',
    image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=600&h=600&fit=crop&crop=faces',
    genre: 'Hip-Hop',
    searchQuery: 'Drake',
  },
  {
    name: 'Beyoncé',
    image: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=600&h=600&fit=crop&crop=faces&q=80',
    genre: 'R&B / Pop',
    searchQuery: 'Beyoncé',
  },
  {
    name: 'The Weeknd',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=600&fit=crop&crop=faces',
    genre: 'R&B / Pop',
    searchQuery: 'The Weeknd',
  },
  {
    name: 'Kendrick Lamar',
    image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=600&h=600&fit=crop&crop=faces&q=80',
    genre: 'Hip-Hop',
    searchQuery: 'Kendrick Lamar',
  },
  {
    name: 'Morgan Wallen',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=600&fit=crop&crop=faces',
    genre: 'Country',
    searchQuery: 'Morgan Wallen',
  },
  {
    name: 'Billie Eilish',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop&crop=faces',
    genre: 'Alt-Pop',
    searchQuery: 'Billie Eilish',
  },
  {
    name: 'Bad Bunny',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=600&fit=crop&crop=faces',
    genre: 'Reggaeton',
    searchQuery: 'Bad Bunny',
  },
];

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
                <Link
                  to={`/search?q=${encodeURIComponent(artist.searchQuery)}`}
                  className="group block text-center"
                >
                  <div className="relative w-full aspect-square rounded-full overflow-hidden mb-3 ring-2 ring-transparent group-hover:ring-primary transition-all duration-300 shadow-lg group-hover:shadow-primary/25">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-display font-bold text-sm lg:text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {artist.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{artist.genre}</p>
                </Link>
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
