import { Link } from 'react-router-dom';
import { CheckCircle2, Ticket, Mail, Calendar } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const OrderSuccessPage = () => {
  const orderNumber = `TV${Date.now().toString().slice(-8)}`;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <CheckCircle2 className="w-12 h-12 text-success" />
          </div>

          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4 animate-slide-up">
            Order Confirmed!
          </h1>

          <p className="text-lg text-muted-foreground mb-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Thank you for your purchase
          </p>

          <p className="text-sm text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            Order #{orderNumber}
          </p>

          <div className="bg-card border border-border rounded-2xl p-6 mb-8 text-left animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">What's Next?</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Check Your Email</p>
                  <p className="text-sm text-muted-foreground">We've sent your tickets and order confirmation to your email address.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Ticket className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Download Tickets</p>
                  <p className="text-sm text-muted-foreground">You can download your mobile tickets from your account or email.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Add to Calendar</p>
                  <p className="text-sm text-muted-foreground">Don't forget to add the event to your calendar so you don't miss it!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Browse More Events
              </Button>
            </Link>
            <Link to="/dashboard" className="flex-1">
              <Button className="w-full bg-primary hover:bg-primary/90">
                View My Tickets
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccessPage;
