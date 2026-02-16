import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdminEmailPayload {
  to: string;
  subject: string;
  body: string; // HTML content for the message body
  recipientName?: string;
}

function buildEmailHTML(payload: AdminEmailPayload): string {
  const name = payload.recipientName || 'Customer';
  
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

        <!-- Message Body -->
        <tr><td>
          <div style="background:#16162a;border:1px solid #2a2a3e;border-radius:16px;padding:32px;margin-bottom:24px;">
            <p style="margin:0 0 16px;color:#a0a0b8;font-size:14px;">Hi ${name},</p>
            <div style="color:#e0e0e0;font-size:15px;line-height:1.7;">
              ${payload.body}
            </div>
          </div>
        </td></tr>

        <!-- Support -->
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

    const payload: AdminEmailPayload = await req.json();

    if (!payload.to || !payload.subject || !payload.body) {
      throw new Error('Missing required fields: to, subject, body');
    }

    const html = buildEmailHTML(payload);

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'TixOrbit <onboarding@resend.dev>',
        to: [payload.to],
        subject: payload.subject,
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
