import { ReactNode, useEffect, useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('marketplace-consent');
    if (!accepted) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('marketplace-consent', 'true');
    setShowConsent(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Dialog open={showConsent} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Info className="w-5 h-5 text-primary" />
              <DialogTitle>Independent Resale Marketplace</DialogTitle>
            </div>
            <DialogDescription className="text-sm leading-relaxed">
              TixOrbit is an independent resale marketplace and is not affiliated with any venue, box office, or official ticket platform. Prices on our platform may be above or below face value.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleAccept} className="w-full mt-2">
            I Understand
          </Button>
        </DialogContent>
      </Dialog>

      <Header />
      <main className="flex-1 pt-16 lg:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};
