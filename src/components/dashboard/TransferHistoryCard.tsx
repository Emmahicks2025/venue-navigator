import { Send, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TransferRow, TicketRow } from '@/hooks/useOrders';

interface TransferHistoryCardProps {
  transfer: TransferRow;
  ticket?: TicketRow;
}

export const TransferHistoryCard = ({ transfer, ticket }: TransferHistoryCardProps) => {
  const statusConfig: Record<string, { icon: React.ReactNode; className: string; label: string }> = {
    pending: {
      icon: <Clock className="w-4 h-4" />,
      className: 'bg-warning/20 text-warning border-warning/30',
      label: 'Pending',
    },
    accepted: {
      icon: <CheckCircle2 className="w-4 h-4" />,
      className: 'bg-success/20 text-success border-success/30',
      label: 'Accepted',
    },
    declined: {
      icon: <XCircle className="w-4 h-4" />,
      className: 'bg-destructive/20 text-destructive border-destructive/30',
      label: 'Declined',
    },
    cancelled: {
      icon: <XCircle className="w-4 h-4" />,
      className: 'bg-muted text-muted-foreground border-border',
      label: 'Cancelled',
    },
  };

  const config = statusConfig[transfer.status] || statusConfig.pending;

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Send className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-display font-bold text-foreground">
              {ticket?.event_name || 'Ticket Transfer'}
            </p>
            {ticket && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {ticket.section_name} · Row {ticket.row_name} · Seat {ticket.seat_number}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Sent to: <span className="text-foreground">{transfer.to_email}</span>
            </p>
            {transfer.message && (
              <p className="text-sm text-muted-foreground mt-1 italic">
                "{transfer.message}"
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {new Date(transfer.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        <Badge variant="outline" className={`gap-1 ${config.className}`}>
          {config.icon}
          {config.label}
        </Badge>
      </div>
    </div>
  );
};
