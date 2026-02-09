import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Ticket, DollarSign, MapPin, Calendar, Clock, Upload, CheckCircle2, ArrowRight, Shield } from 'lucide-react';

const SellTicketsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    eventName: '',
    performer: '',
    venue: '',
    city: '',
    state: '',
    date: '',
    time: '',
    category: '',
    section: '',
    row: '',
    seatFrom: '',
    seatTo: '',
    pricePerTicket: '',
    quantity: '1',
    notes: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to sell tickets');
      navigate('/auth');
      return;
    }

    if (!form.eventName || !form.venue || !form.date || !form.pricePerTicket || !form.section) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'ticket_listings'), {
        user_id: user.uid,
        user_email: user.email,
        event_name: form.eventName,
        performer: form.performer,
        venue_name: form.venue,
        venue_city: form.city,
        venue_state: form.state,
        date: form.date,
        time: form.time,
        category: form.category,
        section_name: form.section,
        row_name: form.row,
        seat_from: form.seatFrom ? parseInt(form.seatFrom) : null,
        seat_to: form.seatTo ? parseInt(form.seatTo) : null,
        price_per_ticket: parseFloat(form.pricePerTicket),
        quantity: parseInt(form.quantity),
        notes: form.notes,
        status: 'pending_review',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      setSubmitted(true);
      toast.success('Your listing has been submitted for review!');
    } catch (err) {
      toast.error('Failed to submit listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center pt-24 pb-16">
          <div className="text-center max-w-md mx-auto px-4 space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">Listing Submitted!</h1>
            <p className="text-muted-foreground">
              Our team will review your ticket listing and it will be live within 24 hours. You'll receive an email confirmation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => { setSubmitted(false); setForm({ eventName: '', performer: '', venue: '', city: '', state: '', date: '', time: '', category: '', section: '', row: '', seatFrom: '', seatTo: '', pricePerTicket: '', quantity: '1', notes: '' }); }}>
                List More Tickets
              </Button>
              <Link to="/dashboard">
                <Button variant="outline">Go to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
              <DollarSign className="w-4 h-4" />
              Sell Your Tickets
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">
              Turn Tickets Into Cash
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              List your tickets in minutes. We handle the rest — secure payment, verified delivery, and buyer protection.
            </p>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { icon: Shield, label: 'Seller Protection', desc: 'Guaranteed payment' },
              { icon: DollarSign, label: 'No Upfront Fees', desc: 'Pay only when sold' },
              { icon: CheckCircle2, label: 'Quick Review', desc: 'Live within 24hrs' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="text-center p-3 rounded-xl border border-border bg-card/50">
                <Icon className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs font-semibold text-foreground">{label}</p>
                <p className="text-[10px] text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          {!user && (
            <div className="mb-8 p-4 rounded-xl border border-primary/30 bg-primary/5 text-center">
              <p className="text-sm text-foreground mb-3">You need to sign in to list tickets for sale.</p>
              <Link to="/auth">
                <Button>
                  Sign In to Continue <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Event Details */}
            <div className="space-y-4">
              <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Event Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="eventName">Event Name *</Label>
                  <Input id="eventName" placeholder="e.g. Taylor Swift - Eras Tour" value={form.eventName} onChange={e => handleChange('eventName', e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="performer">Performer / Team</Label>
                  <Input id="performer" placeholder="e.g. Taylor Swift" value={form.performer} onChange={e => handleChange('performer', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={form.category} onValueChange={v => handleChange('category', v)}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concerts">Concerts</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="theater">Theater</SelectItem>
                      <SelectItem value="comedy">Comedy</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Event Date *</Label>
                  <Input id="date" type="date" value={form.date} onChange={e => handleChange('date', e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="time">Event Time</Label>
                  <Input id="time" type="time" value={form.time} onChange={e => handleChange('time', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Venue */}
            <div className="space-y-4">
              <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Venue
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-3">
                  <Label htmlFor="venue">Venue Name *</Label>
                  <Input id="venue" placeholder="e.g. Madison Square Garden" value={form.venue} onChange={e => handleChange('venue', e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="New York" value={form.city} onChange={e => handleChange('city', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="NY" value={form.state} onChange={e => handleChange('state', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="space-y-4">
              <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <Ticket className="w-5 h-5 text-primary" /> Ticket Details
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="section">Section *</Label>
                  <Input id="section" placeholder="e.g. 101" value={form.section} onChange={e => handleChange('section', e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="row">Row</Label>
                  <Input id="row" placeholder="e.g. A" value={form.row} onChange={e => handleChange('row', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="seatFrom">Seat From</Label>
                  <Input id="seatFrom" type="number" placeholder="1" value={form.seatFrom} onChange={e => handleChange('seatFrom', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="seatTo">Seat To</Label>
                  <Input id="seatTo" type="number" placeholder="2" value={form.seatTo} onChange={e => handleChange('seatTo', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" /> Pricing
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pricePerTicket">Price per Ticket ($) *</Label>
                  <Input id="pricePerTicket" type="number" step="0.01" min="1" placeholder="150.00" value={form.pricePerTicket} onChange={e => handleChange('pricePerTicket', e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Select value={form.quantity} onValueChange={v => handleChange('quantity', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8].map(n => (
                        <SelectItem key={n} value={String(n)}>{n} ticket{n > 1 ? 's' : ''}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea id="notes" placeholder="Any details about your tickets (e.g., obstructed view, aisle seats, includes parking pass)" value={form.notes} onChange={e => handleChange('notes', e.target.value)} rows={3} />
            </div>

            {/* Submit */}
            <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base btn-accent-glow" disabled={isSubmitting || !user}>
              {isSubmitting ? 'Submitting...' : 'Submit Listing'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              By listing, you agree to our <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SellTicketsPage;
