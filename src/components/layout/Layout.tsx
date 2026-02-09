import { ReactNode, useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { X } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      {showBanner && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs sm:text-sm text-center py-1.5 px-8">
          <span className="opacity-90">
            TixOrbit is an independent resale marketplace — not affiliated with any venue or box office. Prices may be above or below face value.
          </span>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <div style={{ paddingTop: showBanner ? '28px' : '0' }}>
        <Header />
      </div>
      <main className="flex-1 pt-16 lg:pt-20" style={{ marginTop: showBanner ? '28px' : '0' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};
