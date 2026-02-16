const sampleOrder = {
  firstName: 'Sarah',
  lastName: 'McLeod',
  orderNumber: 'TO84729163',
  items: [
    {
      eventName: 'Taylor Swift - Eras Tour',
      eventDate: '2026-07-15',
      venueName: 'MetLife Stadium',
      seats: [
        { sectionName: 'Section 112', row: 'C', seatNumber: 14, price: 350 },
        { sectionName: 'Section 112', row: 'C', seatNumber: 15, price: 350 },
      ],
      isFifaEvent: false,
    },
    {
      eventName: 'FIFA World Cup 2026 - USA vs Mexico',
      eventDate: '2026-06-20',
      venueName: 'MetLife Stadium',
      seats: [
        { sectionName: 'Section 234', row: 'F', seatNumber: 8, price: 280 },
      ],
      isFifaEvent: true,
    },
  ],
  subtotal: 980,
  serviceFee: 98,
  total: 1078,
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(price);
}

const EmailPreviewPage = () => {
  const o = sampleOrder;
  const totalTickets = o.items.reduce((sum, item) => sum + item.seats.length, 0);

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#0a0a1a;">
    <tr><td align="center" style="padding:32px 16px;">
      <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;">
        <tr><td style="padding:32px 0;text-align:center;">
          <h1 style="margin:0;font-size:28px;font-weight:800;letter-spacing:-0.5px;">
            <span style="color:#ffffff;">Tix</span><span style="color:#f97316;">Orbit</span>
          </h1>
        </td></tr>
        <tr><td>
          <div style="background:linear-gradient(135deg,#0d2818,#1a3a2a);border:1px solid #22c55e;border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
            <div style="font-size:48px;margin-bottom:12px;">✅</div>
            <h2 style="margin:0 0 8px;color:#ffffff;font-size:24px;font-weight:700;">Order Confirmed!</h2>
            <p style="margin:0 0 4px;color:#a0e8b8;font-size:16px;">Thank you for your purchase, ${o.firstName}!</p>
            <p style="margin:0;color:#66b88a;font-size:14px;">Order #${o.orderNumber}</p>
          </div>
        </td></tr>
        <tr><td style="padding:0 0 16px;">
          <h2 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">
            🎫 Your Tickets <span style="color:#a0a0b8;font-weight:400;font-size:14px;">(${totalTickets} tickets)</span>
          </h2>
        </td></tr>
        ${o.items.map(item => `
        <tr><td>
          <div style="background:#16162a;border:1px solid ${item.isFifaEvent ? '#02B906' : '#2a2a3e'};border-radius:12px;padding:20px;margin-bottom:16px;">
            <h3 style="margin:0 0 4px;color:#ffffff;font-size:18px;font-weight:700;">${item.eventName}</h3>
            <p style="margin:0 0 12px;color:#a0a0b8;font-size:14px;">📍 ${item.venueName} &nbsp;•&nbsp; 📅 ${formatDate(item.eventDate)}</p>
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
              <thead><tr style="background:#1e1e38;">
                <th style="padding:10px 16px;text-align:left;color:#8888a8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #2a2a3e;">Section</th>
                <th style="padding:10px 16px;text-align:left;color:#8888a8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #2a2a3e;">Seat</th>
                <th style="padding:10px 16px;text-align:right;color:#8888a8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #2a2a3e;">Price</th>
              </tr></thead>
              <tbody>${item.seats.map(seat => `
                <tr>
                  <td style="padding:10px 16px;border-bottom:1px solid #2a2a3e;color:#e0e0e0;font-size:14px;">${seat.sectionName}</td>
                  <td style="padding:10px 16px;border-bottom:1px solid #2a2a3e;color:#e0e0e0;font-size:14px;">${item.isFifaEvent ? '<span style="color:#FFDB00;font-weight:600;">Seats assigned by FIFA</span>' : `Row ${seat.row}, Seat ${seat.seatNumber}`}</td>
                  <td style="padding:10px 16px;border-bottom:1px solid #2a2a3e;color:#e0e0e0;font-size:14px;text-align:right;font-weight:600;">${formatPrice(seat.price)}</td>
                </tr>`).join('')}</tbody>
            </table>
            ${item.isFifaEvent ? `
            <div style="background:linear-gradient(135deg,#1a3a2a,#0d2818);border:1px solid #02B906;border-radius:12px;padding:16px 20px;margin-top:12px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
                <td width="36" valign="top"><span style="font-size:22px;">🛡️</span></td>
                <td style="padding-left:10px;">
                  <p style="margin:0 0 4px;color:#02B906;font-weight:700;font-size:14px;">Confirmed & Guaranteed</p>
                  <p style="margin:0;color:#b0b0b0;font-size:13px;line-height:1.5;">Your FIFA World Cup 2026 tickets are confirmed. Digital QR codes will be released by FIFA approximately 7 days before the match. Your purchase is backed by the TickOrbit Buyer Guarantee.</p>
                </td>
              </tr></table>
            </div>` : ''}
          </div>
        </td></tr>`).join('')}
        <tr><td style="padding:8px 0 24px;">
          <div style="background:#16162a;border:1px solid #2a2a3e;border-radius:12px;padding:20px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr><td style="padding:6px 0;color:#a0a0b8;font-size:14px;">Subtotal</td><td style="padding:6px 0;color:#e0e0e0;font-size:14px;text-align:right;">${formatPrice(o.subtotal)}</td></tr>
              <tr><td style="padding:6px 0;color:#a0a0b8;font-size:14px;">Service Fee</td><td style="padding:6px 0;color:#e0e0e0;font-size:14px;text-align:right;">${formatPrice(o.serviceFee)}</td></tr>
              <tr><td colspan="2" style="padding:8px 0 0;"><div style="border-top:1px solid #2a2a3e;"></div></td></tr>
              <tr><td style="padding:10px 0 0;color:#ffffff;font-size:18px;font-weight:700;">Total Paid</td><td style="padding:10px 0 0;color:#f97316;font-size:22px;font-weight:800;text-align:right;">${formatPrice(o.total)}</td></tr>
            </table>
          </div>
        </td></tr>
        <tr><td>
          <div style="background:#16162a;border:1px solid #2a2a3e;border-radius:12px;padding:24px;margin-bottom:24px;">
            <h3 style="margin:0 0 16px;color:#ffffff;font-size:16px;font-weight:700;">📋 What's Next?</h3>
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr><td width="32" valign="top" style="padding:0 0 14px;"><span style="font-size:18px;">📱</span></td><td style="padding:0 0 14px 10px;"><p style="margin:0;color:#ffffff;font-size:14px;font-weight:600;">Download Your Tickets</p><p style="margin:4px 0 0;color:#a0a0b8;font-size:13px;">Access mobile tickets from your TixOrbit account dashboard.</p></td></tr>
              <tr><td width="32" valign="top" style="padding:0 0 14px;"><span style="font-size:18px;">📅</span></td><td style="padding:0 0 14px 10px;"><p style="margin:0;color:#ffffff;font-size:14px;font-weight:600;">Add to Calendar</p><p style="margin:4px 0 0;color:#a0a0b8;font-size:13px;">Don't miss the event — mark it on your calendar now.</p></td></tr>
              <tr><td width="32" valign="top"><span style="font-size:18px;">🔄</span></td><td style="padding-left:10px;"><p style="margin:0;color:#ffffff;font-size:14px;font-weight:600;">Transfer Tickets</p><p style="margin:4px 0 0;color:#a0a0b8;font-size:13px;">Need to send tickets to a friend? Use the transfer feature in your dashboard.</p></td></tr>
            </table>
          </div>
        </td></tr>
        <tr><td>
          <div style="background:linear-gradient(135deg,#1a1a2e,#16162a);border:1px solid #3b82f6;border-radius:12px;padding:20px;text-align:center;margin-bottom:32px;">
            <p style="margin:0;color:#60a5fa;font-size:14px;font-weight:600;">🛡️ TixOrbit Buyer Guarantee — Your tickets are 100% guaranteed or your money back.</p>
          </div>
        </td></tr>
        <tr><td style="text-align:center;padding:16px 0 32px;">
          <p style="margin:0 0 8px;color:#6b6b88;font-size:13px;">Questions? Reply to this email or visit our <a href="#" style="color:#f97316;text-decoration:none;">Help Center</a>.</p>
          <p style="margin:0;color:#4a4a60;font-size:12px;">© 2026 TixOrbit. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-[650px] mx-auto">
        <h1 className="text-xl font-bold text-foreground mb-4">📧 Email Preview — Order Confirmation</h1>
        <iframe
          srcDoc={htmlContent}
          className="w-full border border-border rounded-xl"
          style={{ height: '1600px' }}
          title="Email Preview"
        />
      </div>
    </div>
  );
};

export default EmailPreviewPage;
