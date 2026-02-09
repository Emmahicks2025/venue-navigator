import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Shield, LogOut, Trophy } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';

const navLinks = [
  { href: '/events/concerts', label: 'Concerts' },
  { href: '/events/sports', label: 'Sports' },
  { href: '/events/theater', label: 'Theater' },
  { href: '/events/comedy', label: 'Comedy' },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const totalItems = getTotalItems();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/">
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  location.pathname === link.href
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/events/world-cup"
              className={cn(
                'px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 flex items-center gap-1.5',
                location.pathname === '/events/world-cup'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/40'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/40'
              )}
            >
              <Trophy className="w-4 h-4 text-yellow-300" />
              FIFA World Cup
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            <Link to="/search">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Search className="w-5 h-5" />
              </Button>
            </Link>

            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Admin button - only visible for admins */}
            {isAdmin && (
              <Link to="/admin">
                <Button variant="ghost" size="icon" className="text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10">
                  <Shield className="w-5 h-5" />
                </Button>
              </Link>
            )}

            {/* Auth button */}
            {user ? (
              <Link to="/dashboard">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" title="My Dashboard">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden glass-strong border-t border-border animate-slide-up">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                  location.pathname === link.href
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                to="/dashboard"
                className="px-4 py-3 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                My Dashboard
              </Link>
            )}
            <Link
              to="/events/world-cup"
              className={cn(
                'px-4 py-3 text-sm font-bold rounded-lg transition-all duration-200 flex items-center gap-1.5',
                location.pathname === '/events/world-cup'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/40'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25'
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <Trophy className="w-4 h-4 text-yellow-300" />
              FIFA World Cup
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-3 text-sm font-medium rounded-lg text-yellow-500 hover:bg-yellow-500/10 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Panel
              </Link>
            )}
            {user ? (
              <button
                onClick={() => { signOut(); setIsMenuOpen(false); }}
                className="px-4 py-3 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary text-left transition-all duration-200"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-3 text-sm font-medium rounded-lg text-primary hover:bg-primary/10 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
