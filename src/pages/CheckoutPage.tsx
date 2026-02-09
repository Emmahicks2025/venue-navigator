import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, Check, ChevronLeft } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';
import { formatPrice, formatDate } from '@/data/events';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Loader2 } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const { data: profile } = useUserProfile();
  const [isProcessing, setIsProcessing] = useState(false);
  const submittingRef = useRef(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    billingAddress: '',
    city: '',
    zipCode: '',
  });

  // Auto-fill from user profile when it loads
  useEffect(() => {
    if (user || profile) {
      setFormData(prev => ({
        ...prev,
        email: prev.email || user?.email || '',
        firstName: prev.firstName || profile?.first_name || '',
        lastName: prev.lastName || profile?.last_name || '',
      }));
    }
  }, [user, profile]);

  const totalPrice = getTotalPrice();
  const serviceFee = totalPrice * 0.1;
  const grandTotal = totalPrice + serviceFee;

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    navigate('/auth?redirect=/checkout');
    return null;
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const orderNumber = `TO${Date.now().toString().slice(-8)}`;

      if (user) {
        // Create order in database
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user.uid,
            order_number: orderNumber,
            status: 'confirmed',
            subtotal: totalPrice,
            service_fee: serviceFee,
            total: grandTotal,
            billing_email: formData.email,
            billing_first_name: formData.firstName,
            billing_last_name: formData.lastName,
            billing_address: formData.billingAddress,
            billing_city: formData.city,
            billing_zip: formData.zipCode,
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // Create tickets for each seat in each cart item
        const ticketInserts = items.flatMap((item) =>
          item.seats.map((seat) => ({
            order_id: order.id,
            user_id: user.uid,
            event_id: item.eventId,
            event_name: item.eventName,
            event_date: item.eventDate,
            venue_name: item.venueName,
            performer: item.performer || null,
            performer_image: item.performerImage || null,
            section_name: seat.sectionName,
            row_name: seat.row,
            seat_number: seat.seatNumber,
            price: seat.price,
            status: 'active',
          }))
        );

        const { error: ticketsError } = await supabase
          .from('tickets')
          .insert(ticketInserts);

        if (ticketsError) throw ticketsError;

        // Also update profile name if it was empty
        if (profile && !profile.first_name && formData.firstName) {
          await supabase
            .from('profiles')
            .update({ first_name: formData.firstName, last_name: formData.lastName })
            .eq('user_id', user.uid);
        }
      }

      clearCart();
      toast.success('Order confirmed! Check your email for tickets.');
      navigate('/order-success');
    } catch (err: any) {
      toast.error(err.message || 'Payment failed. Please try again.');
      submittingRef.current = false;
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <Button
          variant="ghost"
          onClick={() => navigate('/cart')}
          className="mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Checkout Form */}
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-6">Checkout</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Info */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      required
                      className="mt-1"
                      readOnly={!!user?.email}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-lg font-semibold text-foreground">Payment Details</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        type="password"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">Billing Address</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="billingAddress">Street Address</Label>
                    <Input
                      id="billingAddress"
                      name="billingAddress"
                      value={formData.billingAddress}
                      onChange={handleInputChange}
                      placeholder="123 Main St"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="10001"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-lg btn-accent-glow"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Pay {formatPrice(grandTotal)}
                  </span>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                <Lock className="w-3 h-3" />
                Your payment is secured with 256-bit encryption
              </p>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold text-foreground mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.eventId} className="pb-4 border-b border-border last:border-0">
                    <h3 className="font-semibold text-foreground mb-1">{item.eventName}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.venueName} • {formatDate(item.eventDate)}
                    </p>
                    <div className="space-y-1">
                      {item.seats.map((seat, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {seat.sectionName} - Row {seat.row}, Seat {seat.seatNumber}
                          </span>
                          <span className="text-foreground">{formatPrice(seat.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="text-foreground">{formatPrice(serviceFee)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-accent">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-success/10 rounded-xl border border-success/20">
                <div className="flex items-center gap-2 text-success text-sm font-medium">
                  <Check className="w-4 h-4" />
                  Buyer Protection Guaranteed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
