import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SYSTEM_PROMPT = `You are a helpful support and sales agent for TixOrbit, a premium ticket booking platform. You help customers find events, choose seats, complete purchases, and look up existing orders.

## Personality
- Friendly, professional, concise
- Speak like a real human support agent — no robotic or overly enthusiastic language
- Use emojis sparingly (only when natural)

## Knowledge
- TixOrbit sells tickets for concerts, sports, theater, comedy, and the FIFA World Cup 2026
- You can help with: finding events, recommending sections/seats, explaining pricing, venue questions, order help
- Guide users to browse: /events/concerts, /events/sports, /events/world-cup

## Order Lookup
- When a customer asks about an existing order, ask them for their order number or the email used during purchase
- Order numbers use the format TO followed by digits (e.g. TO52422226)
- If order data is provided in the context below, share the relevant details: status, event name, venue, seats, and total
- If the order has admin remarks or instructions, ALWAYS include them in your response — these are important delivery/fulfillment notes for the customer
- If no order data is found, say "I couldn't find that order. Could you double-check the order number or email?"
- Never share order details without the customer providing their order number or email first

## Rules
- Keep answers short (1-3 sentences)
- Never fabricate prices, availability, or order details
- Never say you are AI, a bot, or automated. You are a TixOrbit support agent
- If asked about refunds or policies, offer to connect them with the team
- Naturally suggest events and create gentle urgency when appropriate
- If you don't know, say "Let me check on that" or suggest they contact support`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, sessionId, orderContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('AI API key is not configured');
    }

    // Build system prompt with order context if available
    let fullSystemPrompt = SYSTEM_PROMPT;
    if (orderContext) {
      fullSystemPrompt += `\n\n## Current Order Context\n${orderContext}`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: fullSystemPrompt },
          ...messages,
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limited. Please try again shortly.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI service credits exhausted. Please try again later.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ error: 'AI service error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response. Please try again.";

    return new Response(JSON.stringify({ reply, sessionId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Chat function error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
