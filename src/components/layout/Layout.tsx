import { ReactNode, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { toast } from 'sonner';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  useEffect(() => {
    const dismissed = sessionStorage.getItem('marketplace-notice');
    if (!dismissed) {
      toast.info('Independent Resale Marketplace', {
        description: 'TixOrbit is not affiliated with any venue or box office. Prices may be above or below face value.',
        duration: 8000,
        onDismiss: () => sessionStorage.setItem('marketplace-notice', 'true'),
        onAutoClose: () => sessionStorage.setItem('marketplace-notice', 'true'),
      });
      sessionStorage.setItem('marketplace-notice', 'true');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16 lg:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};
