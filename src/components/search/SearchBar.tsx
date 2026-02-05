import { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
  className?: string;
  placeholder?: string;
}

export const SearchBar = ({ 
  variant = 'compact', 
  className,
  placeholder = 'Search events, artists, venues...'
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSearch} className={cn('w-full max-w-2xl mx-auto', className)}>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
          <div className="relative flex items-center bg-card/90 backdrop-blur-sm border border-border rounded-2xl overflow-hidden shadow-lg">
            <div className="flex items-center pl-5 pr-3">
              <Search className="w-5 h-5 text-muted-foreground" />
            </div>
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 border-0 bg-transparent text-base py-6 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70"
            />
            <div className="pr-2">
              <Button 
                type="submit" 
                className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium btn-glow"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-10 bg-secondary border-border"
      />
    </form>
  );
};
