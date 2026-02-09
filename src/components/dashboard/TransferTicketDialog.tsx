import { useState } from 'react';
import { Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { TicketRow } from '@/hooks/useOrders';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface TransferTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: TicketRow;
  onTransferComplete: () => void;
}

export const TransferTicketDialog = ({
  open,
  onOpenChange,
  ticket,
  onTransferComplete,
}: TransferTicketDialogProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTransfer = async () => {
    if (!user || !recipientEmail.trim()) return;

    if (recipientEmail.trim() === user.email) {
      toast.error("You can't transfer a ticket to yourself.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create transfer record in Firestore
      await addDoc(collection(db, 'ticket_transfers'), {
        ticket_id: ticket.id,
        from_user_id: user.uid,
        to_email: recipientEmail.trim(),
        message: message.trim() || null,
        status: 'pending',
        to_user_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Update ticket status
      await updateDoc(doc(db, 'tickets', ticket.id), {
        status: 'transferred',
        updated_at: new Date().toISOString(),
      });

      queryClient.invalidateQueries({ queryKey: ['user-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['user-transfers'] });

      toast.success(`Transfer initiated to ${recipientEmail}`);
      setRecipientEmail('');
      setMessage('');
      onTransferComplete();
    } catch (err: any) {
      toast.error(err.message || 'Failed to transfer ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Transfer Ticket</DialogTitle>
          <DialogDescription>
            Send this ticket to someone else. They'll receive it via email.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-secondary/50 rounded-xl p-4 mb-4">
          <p className="font-semibold text-foreground text-sm">{ticket.event_name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {ticket.section_name} · Row {ticket.row_name} · Seat {ticket.seat_number}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="recipientEmail">Recipient's Email</Label>
            <Input
              id="recipientEmail"
              type="email"
              placeholder="friend@example.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="transferMessage">Message (optional)</Label>
            <Textarea
              id="transferMessage"
              placeholder="Enjoy the show!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          <Button
            onClick={handleTransfer}
            disabled={isSubmitting || !recipientEmail.trim()}
            className="w-full bg-primary hover:bg-primary/90 gap-2"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Transferring...' : 'Transfer Ticket'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
