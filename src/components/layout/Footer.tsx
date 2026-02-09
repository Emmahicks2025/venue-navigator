import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Logo } from './Logo';

const supportLinks = [
  { label: 'Help Center / FAQs', to: '/help' },
  { label: 'Order Status', to: '/dashboard' },
  { label: 'Contact Us', to: '/help#contact' },
  { label: 'Buyer Guarantee', to: '/terms#buyer-guarantee' },
];

const legalLinks = [
  { label: 'Terms of Use', to: '/terms' },
  { label: 'Privacy Policy', to: '/privacy' },
];

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/">
              <Logo size="sm" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your premium destination for live event tickets. Experience concerts, sports, theater, and more.
            </p>
            <p className="text-xs text-muted-foreground/70 leading-relaxed">
              TixOrbit is an independent resale marketplace. We are not affiliated with any venue or box office. Prices may be above or below face value.
            </p>
          </div>

          {/* Events */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Events</h4>
            <ul className="space-y-2">
              {[
                { label: 'Concerts', to: '/events/concerts' },
                { label: 'Sports', to: '/events/sports' },
                { label: 'Theater', to: '/events/theater' },
                { label: 'Comedy', to: '/events/comedy' },
                { label: 'FIFA World Cup 2026', to: '/events/world-cup' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                support@tixorbit.com
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                1-800-TICKETS
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                New York, NY
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom legal bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 TixOrbit Inc. All rights reserved. Use of this website constitutes acceptance of our{' '}
            <Link to="/terms" className="text-primary hover:underline">Terms of Use</Link> and{' '}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
          <div className="flex gap-6">
            {legalLinks.map((link) => (
              <Link key={link.label} to={link.to} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
