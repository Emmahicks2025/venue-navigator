import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TicketInfo {
  sectionName: string;
  row: string;
  seatNumber: number;
  price: number;
}

interface OrderItem {
  eventName: string;
  eventDate: string;
  venueName: string;
  performer?: string;
  seats: TicketInfo[];
  isFifaEvent?: boolean;
}

interface OrderPayload {
  to: string;
  firstName: string;
  lastName: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  serviceFee: number;
  total: number;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price);
}

function buildTicketRows(item: OrderItem): string {
  return item.seats.map(seat => {
    const seatInfo = item.isFifaEvent
      ? `<span style="color:#FFDB00;font-weight:600;">Seats assigned by FIFA</span>`
      : `Row ${seat.row}, Seat ${seat.seatNumber}`;
    return `
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid #2a2a3e;color:#e0e0e0;font-size:14px;">${seat.sectionName}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #2a2a3e;color:#e0e0e0;font-size:14px;">${seatInfo}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #2a2a3e;color:#e0e0e0;font-size:14px;text-align:right;font-weight:600;">${formatPrice(seat.price)}</td>
      </tr>`;
  }).join('');
}

function buildFifaNotice(item: OrderItem): string {
  if (!item.isFifaEvent) return '';
  return `
    <div style="background:linear-gradient(135deg,#1a3a2a,#0d2818);border:1px solid #02B906;border-radius:12px;padding:16px 20px;margin-top:12px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
        <td width="36" valign="top"><span style="font-size:22px;">🛡️</span></td>
        <td style="padding-left:10px;">
          <p style="margin:0 0 4px;color:#02B906;font-weight:700;font-size:14px;">Confirmed & Guaranteed</p>
          <p style="margin:0;color:#b0b0b0;font-size:13px;line-height:1.5;">
            Your FIFA World Cup 2026 tickets are confirmed. Digital QR codes will be released by FIFA approximately 7 days before the match. 
            Your purchase is backed by the TickOrbit Buyer Guarantee.
          </p>
        </td>
      </tr></table>
    </div>`;
}

function buildItemBlock(item: OrderItem): string {
  return `
    <div style="background:#16162a;border:1px solid ${item.isFifaEvent ? '#02B906' : '#2a2a3e'};border-radius:12px;padding:20px;margin-bottom:16px;">
      <h3 style="margin:0 0 4px;color:#ffffff;font-size:18px;font-weight:700;">${item.eventName}</h3>
      <p style="margin:0 0 12px;color:#a0a0b8;font-size:14px;">
        📍 ${item.venueName} &nbsp;•&nbsp; 📅 ${formatDate(item.eventDate)}
      </p>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
        <thead>
          <tr style="background:#1e1e38;">
            <th style="padding:10px 16px;text-align:left;color:#8888a8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #2a2a3e;">Section</th>
            <th style="padding:10px 16px;text-align:left;color:#8888a8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #2a2a3e;">Seat</th>
            <th style="padding:10px 16px;text-align:right;color:#8888a8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #2a2a3e;">Price</th>
          </tr>
        </thead>
        <tbody>${buildTicketRows(item)}</tbody>
      </table>
      ${buildFifaNotice(item)}
    </div>`;
}

function buildEmailHTML(order: OrderPayload): string {
  const itemsHTML = order.items.map(buildItemBlock).join('');
  const totalTickets = order.items.reduce((sum, item) => sum + item.seats.length, 0);

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#0a0a1a;">
    <tr><td align="center" style="padding:32px 16px;">
      <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;">
        
        <!-- Header -->
        <tr><td style="padding:32px 0;text-align:center;">
          <h1 style="margin:0;font-size:28px;font-weight:800;letter-spacing:-0.5px;">
            <span style="color:#ffffff;">Tix</span><span style="color:#f97316;">Orbit</span>
          </h1>
        </td></tr>

        <!-- Success Banner -->
        <tr><td>
          <div style="background:linear-gradient(135deg,#0d2818,#1a3a2a);border:1px solid #22c55e;border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
            <div style="font-size:48px;margin-bottom:12px;">✅</div>
            <h2 style="margin:0 0 8px;color:#ffffff;font-size:24px;font-weight:700;">Order Confirmed!</h2>
            <p style="margin:0 0 4px;color:#a0e8b8;font-size:16px;">Thank you for your purchase, ${order.firstName}!</p>
            <p style="margin:0;color:#66b88a;font-size:14px;">Order #${order.orderNumber}</p>
          </div>
        </td></tr>

        <!-- Ticket Summary Header -->
        <tr><td style="padding:0 0 16px;">
          <h2 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">
            🎫 Your Tickets <span style="color:#a0a0b8;font-weight:400;font-size:14px;">(${totalTickets} ticket${totalTickets > 1 ? 's' : ''})</span>
          </h2>
        </td></tr>

        <!-- Event Items -->
        <tr><td>${itemsHTML}</td></tr>

        <!-- Order Total -->
        <tr><td style="padding:8px 0 24px;">
          <div style="background:#16162a;border:1px solid #2a2a3e;border-radius:12px;padding:20px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="padding:6px 0;color:#a0a0b8;font-size:14px;">Subtotal</td>
                <td style="padding:6px 0;color:#e0e0e0;font-size:14px;text-align:right;">${formatPrice(order.subtotal)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#a0a0b8;font-size:14px;">Service Fee</td>
                <td style="padding:6px 0;color:#e0e0e0;font-size:14px;text-align:right;">${formatPrice(order.serviceFee)}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding:8px 0 0;"><div style="border-top:1px solid #2a2a3e;"></div></td>
              </tr>
              <tr>
                <td style="padding:10px 0 0;color:#ffffff;font-size:18px;font-weight:700;">Total Paid</td>
                <td style="padding:10px 0 0;color:#f97316;font-size:22px;font-weight:800;text-align:right;">${formatPrice(order.total)}</td>
              </tr>
            </table>
          </div>
        </td></tr>

        <!-- What's Next -->
        <tr><td>
          <div style="background:#16162a;border:1px solid #2a2a3e;border-radius:12px;padding:24px;margin-bottom:24px;">
            <h3 style="margin:0 0 16px;color:#ffffff;font-size:16px;font-weight:700;">📋 What's Next?</h3>
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td width="32" valign="top" style="padding:0 0 14px;"><span style="font-size:18px;">📱</span></td>
                <td style="padding:0 0 14px 10px;">
                  <p style="margin:0;color:#ffffff;font-size:14px;font-weight:600;">Download Your Tickets</p>
                  <p style="margin:4px 0 0;color:#a0a0b8;font-size:13px;">Access mobile tickets from your TixOrbit account dashboard.</p>
                </td>
              </tr>
              <tr>
                <td width="32" valign="top" style="padding:0 0 14px;"><span style="font-size:18px;">📅</span></td>
                <td style="padding:0 0 14px 10px;">
                  <p style="margin:0;color:#ffffff;font-size:14px;font-weight:600;">Add to Calendar</p>
                  <p style="margin:4px 0 0;color:#a0a0b8;font-size:13px;">Don't miss the event — mark it on your calendar now.</p>
                </td>
              </tr>
              <tr>
                <td width="32" valign="top"><span style="font-size:18px;">🔄</span></td>
                <td style="padding-left:10px;">
                  <p style="margin:0;color:#ffffff;font-size:14px;font-weight:600;">Transfer Tickets</p>
                  <p style="margin:4px 0 0;color:#a0a0b8;font-size:13px;">Need to send tickets to a friend? Use the transfer feature in your dashboard.</p>
                </td>
              </tr>
            </table>
          </div>
        </td></tr>

        <!-- Buyer Protection -->
        <tr><td>
          <div style="background:linear-gradient(135deg,#1a1a2e,#16162a);border:1px solid #3b82f6;border-radius:12px;padding:20px;text-align:center;margin-bottom:32px;">
            <p style="margin:0;color:#60a5fa;font-size:14px;font-weight:600;">
              🛡️ TixOrbit Buyer Guarantee — Your tickets are 100% guaranteed or your money back.
            </p>
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="text-align:center;padding:16px 0 32px;">
          <p style="margin:0 0 8px;color:#6b6b88;font-size:13px;">
            Questions? Reply to this email or visit our <a href="https://ticket-canvas-stage.lovable.app/help" style="color:#f97316;text-decoration:none;">Help Center</a>.
          </p>
          <p style="margin:0;color:#4a4a60;font-size:12px;">
            © ${new Date().getFullYear()} TixOrbit. All rights reserved.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const order: OrderPayload = await req.json();

    const html = buildEmailHTML(order);

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'TixOrbit <onboarding@resend.dev>',
        to: [order.to],
        subject: `Order Confirmed! 🎫 #${order.orderNumber}`,
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Resend API error:', data);
      throw new Error(`Resend API error [${res.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Email send error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
