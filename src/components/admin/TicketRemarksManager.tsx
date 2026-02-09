import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Save, MessageSquare, Ticket } from 'lucide-react';
import { toast } from 'sonner';

interface TicketData {
  id: string;
  event_name: string;
  venue_name: string;
  section_name: string;
  row_name: string;
  seat_number: number;
  event_date: string;
  status: string;
  remarks: string | null;
  order_id: string;
  user_id: string;
  performer: string | null;
}

const DEFAULT_REMARK = "You will receive your tickets from the seller. Please check your email for delivery instructions and updates regarding your order.";

export const TicketRemarksManager = () => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRemarks, setEditingRemarks] = useState<Record<string, string>>({});
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'tickets'), orderBy('event_date', 'desc'));
      const snap = await getDocs(q);
      setTickets(snap.docs.map(d => ({ id: d.id, ...d.data() } as TicketData)));
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleSaveRemarks = async (ticketId: string) => {
    const newRemarks = editingRemarks[ticketId];
    if (newRemarks === undefined) return;

    setSavingIds(prev => new Set(prev).add(ticketId));
    try {
      await updateDoc(doc(db, 'tickets', ticketId), {
        remarks: newRemarks.trim() || null,
      });
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, remarks: newRemarks.trim() || null } : t));
      setEditingRemarks(prev => { const n = { ...prev }; delete n[ticketId]; return n; });
      toast.success('Remarks saved');
    } catch (err) {
      console.error('Failed to save remarks:', err);
      toast.error('Failed to save remarks');
    } finally {
      setSavingIds(prev => { const n = new Set(prev); n.delete(ticketId); return n; });
    }
  };

  const filtered = tickets.filter(t => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      t.event_name.toLowerCase().includes(s) ||
      t.venue_name.toLowerCase().includes(s) ||
      t.section_name.toLowerCase().includes(s) ||
      (t.performer || '').toLowerCase().includes(s)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{tickets.length} total tickets</p>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by event, venue, performer..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No tickets found</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(ticket => {
            const isEditing = editingRemarks[ticket.id] !== undefined;
            const currentRemarks = isEditing ? editingRemarks[ticket.id] : (ticket.remarks || '');
            const isSaving = savingIds.has(ticket.id);

            return (
              <Card key={ticket.id} className="border-border">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Ticket info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Ticket className="w-4 h-4 text-primary flex-shrink-0" />
                        <h4 className="font-semibold text-foreground truncate">{ticket.event_name}</h4>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {ticket.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {ticket.venue_name} · {ticket.section_name} · Row {ticket.row_name} · Seat {ticket.seat_number}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {ticket.event_date}
                      </p>
                    </div>

                    {/* Remarks editor */}
                    <div className="lg:w-96 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Remarks {ticket.remarks ? '(custom)' : '(default)'}</span>
                      </div>
                      <Textarea
                        placeholder={DEFAULT_REMARK}
                        value={currentRemarks}
                        onChange={e => setEditingRemarks(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                        rows={2}
                        className="text-sm resize-none"
                      />
                      {isEditing && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveRemarks(ticket.id)}
                            disabled={isSaving}
                            className="gap-1.5"
                          >
                            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingRemarks(prev => { const n = { ...prev }; delete n[ticket.id]; return n; })}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
