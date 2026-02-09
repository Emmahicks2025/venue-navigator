import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';

export const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay so it doesn't clash with page load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', 'all');
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem('cookie-consent', 'essential');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[70] animate-slide-up">
      <div className="bg-card/95 backdrop-blur-xl border-t border-border shadow-2xl">
        <div className="container mx-auto px-4 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                We use cookies and similar technologies to enhance your experience, analyze site traffic, and personalize content. By clicking "Accept All," you consent to the use of all cookies. You can manage your preferences or learn more in our{' '}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEssentialOnly}
                className="flex-1 sm:flex-none text-xs"
              >
                Essential Only
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="flex-1 sm:flex-none text-xs"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
