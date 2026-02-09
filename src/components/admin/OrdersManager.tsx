import { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, getDocs, doc, updateDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Loader2, Search, Eye, RefreshCw, DollarSign, ShoppingCart, AlertTriangle, CheckCircle, XCircle, Clock, Package, Save, MessageSquare } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { formatPrice } from '@/data/events';

interface OrderData {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  subtotal: number;
  service_fee: number;
  total: number;
  billing_email: string | null;
  billing_first_name: string | null;
  billing_last_name: string | null;
  billing_address: string | null;
  billing_city: string | null;
  billing_zip: string | null;
  remarks: string | null;
  created_at: any;
}

interface TicketData {
  id: string;
  event_name: string;
  venue_name: string;
  section_name: string;
  row_name: string;
  seat_number: number;
  price: number;
  status: string;
  event_date: string;
  event_time: string;
  performer: string | null;
  barcode: string;
  remarks: string | null;
}

const STATUS_OPTIONS = ['confirmed', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'abandoned'];

const statusConfig: Record<string, { icon: React.ElementType; color: string }> = {
  confirmed: { icon: CheckCircle, color: 'bg-success/20 text-success border-success/30' },
  pending: { icon: Clock, color: 'bg-warning/20 text-warning border-warning/30' },
  processing: { icon: Package, color: 'bg-primary/20 text-primary border-primary/30' },
  shipped: { icon: Package, color: 'bg-primary/20 text-primary border-primary/30' },
  delivered: { icon: CheckCircle, color: 'bg-success/20 text-success border-success/30' },
  cancelled: { icon: XCircle, color: 'bg-destructive/20 text-destructive border-destructive/30' },
  refunded: { icon: DollarSign, color: 'bg-muted text-muted-foreground border-border' },
  abandoned: { icon: AlertTriangle, color: 'bg-warning/20 text-warning border-warning/30' },
};

export const OrdersManager = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [orderTickets, setOrderTickets] = useState<TicketData[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [editingRemarks, setEditingRemarks] = useState('');
  const [savingRemarks, setSavingRemarks] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('created_at', 'desc'));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          created_at: data.created_at?.toDate?.()?.toISOString?.() || data.created_at || new Date().toISOString(),
        } as OrderData;
      }));
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrderTickets = async (orderId: string) => {
    setLoadingTickets(true);
    try {
      const q = query(collection(db, 'tickets'), where('order_id', '==', orderId));
      const snap = await getDocs(q);
      setOrderTickets(snap.docs.map(d => ({ id: d.id, ...d.data() } as TicketData)));
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      toast.error('Failed to load tickets for this order');
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleViewOrder = (order: OrderData) => {
    setSelectedOrder(order);
    setEditingRemarks(order.remarks || '');
    fetchOrderTickets(order.id);
  };

  const handleSaveRemarks = async () => {
    if (!selectedOrder) return;
    setSavingRemarks(true);
    try {
      const newRemarks = editingRemarks.trim() || null;
      await updateDoc(doc(db, 'orders', selectedOrder.id), { remarks: newRemarks });
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, remarks: newRemarks } : o));
      setSelectedOrder(prev => prev ? { ...prev, remarks: newRemarks } : null);
      toast.success('Order remarks saved');
    } catch (err) {
      console.error('Failed to save remarks:', err);
      toast.error('Failed to save remarks');
    } finally {
      setSavingRemarks(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus, updated_at: new Date().toISOString() });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filtered = useMemo(() => {
    let result = [...orders];

    if (statusFilter !== 'all') {
      result = result.filter(o => o.status === statusFilter);
    }

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      result = result.filter(o =>
        o.order_number.toLowerCase().includes(s) ||
        (o.billing_email || '').toLowerCase().includes(s) ||
        (o.billing_first_name || '').toLowerCase().includes(s) ||
        (o.billing_last_name || '').toLowerCase().includes(s)
      );
    }

    switch (sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'highest':
        result.sort((a, b) => b.total - a.total);
        break;
      case 'lowest':
        result.sort((a, b) => a.total - b.total);
        break;
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [orders, statusFilter, searchTerm, sortBy]);

  // Stats
  const stats = useMemo(() => {
    const total = orders.length;
    const confirmed = orders.filter(o => o.status === 'confirmed' || o.status === 'delivered').length;
    const abandoned = orders.filter(o => o.status === 'abandoned').length;
    const cancelled = orders.filter(o => o.status === 'cancelled' || o.status === 'refunded').length;
    const revenue = orders
      .filter(o => o.status !== 'cancelled' && o.status !== 'refunded' && o.status !== 'abandoned')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    return { total, confirmed, abandoned, cancelled, revenue };
  }, [orders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total Orders" value={stats.total} icon={ShoppingCart} />
        <StatCard label="Confirmed" value={stats.confirmed} icon={CheckCircle} color="text-success" />
        <StatCard label="Abandoned" value={stats.abandoned} icon={AlertTriangle} color="text-warning" />
        <StatCard label="Cancelled/Refunded" value={stats.cancelled} icon={XCircle} color="text-destructive" />
        <StatCard label="Revenue" value={formatPrice(stats.revenue)} icon={DollarSign} color="text-accent" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search order #, email, name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUS_OPTIONS.map(s => (
                <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Total</SelectItem>
              <SelectItem value="lowest">Lowest Total</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchOrders}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} orders shown</p>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No orders found</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(order => {
            const cfg = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = cfg.icon;
            return (
              <Card key={order.id} className="border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <StatusIcon className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-semibold text-foreground">{order.order_number}</span>
                          <Badge variant="outline" className={cfg.color}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {order.billing_first_name} {order.billing_last_name}
                          {order.billing_email && ` · ${order.billing_email}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-accent">{formatPrice(order.total)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <Select
                        value={order.status}
                        onValueChange={(v) => handleUpdateStatus(order.id, v)}
                        disabled={updatingStatus === order.id}
                      >
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map(s => (
                            <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => { if (!open) setSelectedOrder(null); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="font-mono">{selectedOrder.order_number}</span>
                  <Badge variant="outline" className={statusConfig[selectedOrder.status]?.color || ''}>
                    {selectedOrder.status}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5">
                {/* Customer Info */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Customer Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <DetailRow label="Name" value={`${selectedOrder.billing_first_name || ''} ${selectedOrder.billing_last_name || ''}`.trim() || '—'} />
                    <DetailRow label="Email" value={selectedOrder.billing_email || '—'} />
                    <DetailRow label="Address" value={selectedOrder.billing_address || '—'} />
                    <DetailRow label="City / ZIP" value={`${selectedOrder.billing_city || ''} ${selectedOrder.billing_zip || ''}`.trim() || '—'} />
                    <DetailRow label="User ID" value={selectedOrder.user_id} mono />
                  </div>
                </div>

                <Separator />

                {/* Payment Summary */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Payment Summary</h4>
                  <div className="bg-secondary/50 border border-border rounded-lg p-3 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span className="text-foreground">{formatPrice(selectedOrder.service_fee)}</span>
                    </div>
                    <Separator className="my-1" />
                    <div className="flex justify-between font-bold">
                      <span className="text-foreground">Total</span>
                      <span className="text-accent">{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Order Timeline */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Order Date</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedOrder.created_at).toLocaleString('en-US', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>

                <Separator />

                {/* Status Update */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Update Status</h4>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(v) => handleUpdateStatus(selectedOrder.id, v)}
                    disabled={updatingStatus === selectedOrder.id}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(s => (
                        <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Order Remarks */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    Order Remarks / Instructions
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Add notes or delivery instructions for this order. These will be shared with the customer when they inquire via chat.
                  </p>
                  <Textarea
                    placeholder="e.g. Tickets will be emailed 24 hours before the event. Please check your spam folder."
                    value={editingRemarks}
                    onChange={e => setEditingRemarks(e.target.value)}
                    rows={3}
                    className="text-sm resize-none mb-2"
                  />
                  <Button
                    size="sm"
                    onClick={handleSaveRemarks}
                    disabled={savingRemarks || editingRemarks === (selectedOrder.remarks || '')}
                    className="gap-1.5"
                  >
                    {savingRemarks ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    Save Remarks
                  </Button>
                </div>

                <Separator />
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Tickets ({loadingTickets ? '...' : orderTickets.length})
                  </h4>
                  {loadingTickets ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                  ) : orderTickets.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No tickets found for this order</p>
                  ) : (
                    <div className="space-y-2">
                      {orderTickets.map(t => (
                        <div key={t.id} className="bg-secondary/50 border border-border rounded-lg p-3 text-sm">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-foreground">{t.event_name}</p>
                              <p className="text-muted-foreground">{t.venue_name}</p>
                              <p className="text-muted-foreground">
                                {t.section_name} · Row {t.row_name} · Seat {t.seat_number}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {t.event_date} at {t.event_time}
                              </p>
                              {t.remarks && (
                                <p className="text-xs text-primary mt-1">📋 {t.remarks}</p>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-accent">{formatPrice(t.price)}</p>
                              <Badge variant="outline" className="text-xs mt-1">
                                {t.status}
                              </Badge>
                              <p className="text-[10px] text-muted-foreground font-mono mt-1">
                                {t.barcode.slice(0, 8).toUpperCase()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helpers
const StatCard = ({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: React.ElementType; color?: string }) => (
  <Card className="border-border">
    <CardContent className="p-4 flex items-center gap-3">
      <Icon className={`w-5 h-5 flex-shrink-0 ${color || 'text-muted-foreground'}`} />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-bold text-foreground text-lg">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const DetailRow = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className={`text-foreground ${mono ? 'font-mono text-xs break-all' : ''}`}>{value}</p>
  </div>
);
