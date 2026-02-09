import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, CalendarCheck, Ticket, Trophy } from 'lucide-react';

interface FifaTicketDisclosureProps {
  open: boolean;
  onAccept: () => void;
  onCancel: () => void;
}

export function FifaTicketDisclosure({ open, onAccept, onCancel }: FifaTicketDisclosureProps) {
  const [agreed, setAgreed] = useState(false);

  const handleAccept = () => {
    if (!agreed) return;
    setAgreed(false);
    onAccept();
  };

  const handleCancel = () => {
    setAgreed(false);
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleCancel(); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFDB00] to-[#FFB800] shadow-sm">
              <Trophy className="w-4 h-4 text-black" />
            </div>
            <DialogTitle className="text-lg font-bold">Ticket Delivery Disclosure</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            Please review and confirm the following regarding your FIFA World Cup tickets:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            By proceeding with this payment, you acknowledge and agree to the following:
          </p>

          <div className="space-y-3">
            <div className="flex gap-3 p-3 rounded-xl bg-[#02B906]/10 border border-[#02B906]/20">
              <Shield className="w-5 h-5 text-[#02B906] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Guaranteed Fulfillment</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your tickets are secured. The seller has won the official FIFA draw, the tickets are fully paid, and they are currently held in the TixOrbit Secure Transfer Vault.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20">
              <CalendarCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">FIFA Release Schedule</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Official QR codes and ticket numbers are released by FIFA in waves. Your digital tickets will be delivered to your TixOrbit dashboard 7 days before the match.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded-xl bg-accent/10 border border-accent/20">
              <Ticket className="w-5 h-5 text-accent mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Transfer Guarantee</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  This purchase acts as a legal guarantee of ownership. You will receive a formal confirmation email immediately after payment, with the digital QR transfer following on the scheduled release date.
                </p>
              </div>
            </div>
          </div>

          <label className="flex items-start gap-3 p-3 rounded-xl border border-border cursor-pointer hover:bg-secondary/30 transition-colors">
            <Checkbox
              checked={agreed}
              onCheckedChange={(c) => setAgreed(c === true)}
              className="mt-0.5"
            />
            <span className="text-sm text-foreground leading-snug">
              I understand that my tickets are guaranteed and will be available in my dashboard <strong>1 week prior</strong> to the event.
            </span>
          </label>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleAccept}
            disabled={!agreed}
            className="bg-[#02B906] hover:bg-[#02B906]/90 text-white"
          >
            Continue to Purchase
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
