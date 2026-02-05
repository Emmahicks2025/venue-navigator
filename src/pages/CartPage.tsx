import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Ticket } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { formatPrice, formatDate } from '@/data/events';

const CartPage = () => {
  const { items, removeFromCart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const totalPrice = getTotalPrice();
  const serviceFee = totalPrice * 0.1;
  const grandTotal = totalPrice + serviceFee;

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any tickets yet. Browse our events to find your next experience!
            </p>
            <Link to="/">
              <Button className="bg-primary hover:bg-primary/90">Browse Events</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">Your Cart</h1>
          <Button variant="ghost" onClick={clearCart} className="text-destructive hover:text-destructive/90">
            Clear All
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.eventId}
                className="bg-card border border-border rounded-2xl p-6 animate-fade-in"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-1">{item.eventName}</h3>
                    <p className="text-sm text-muted-foreground">{item.venueName}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(item.eventDate)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.eventId)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {item.seats.map((seat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-t border-border first:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Ticket className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{seat.sectionName}</p>
                          <p className="text-xs text-muted-foreground">
                            Row {seat.row}, Seat {seat.seatNumber}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-foreground">{formatPrice(seat.price)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Subtotal ({item.seats.length} tickets)</p>
                  <p className="font-bold text-accent">
                    {formatPrice(item.seats.reduce((sum, s) => sum + s.price, 0))}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold text-foreground mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tickets</span>
                  <span className="text-foreground">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="text-foreground">{formatPrice(serviceFee)}</span>
                </div>
                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-accent">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold btn-accent-glow"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="mt-6 text-center">
                <Link to="/" className="text-sm text-primary hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
