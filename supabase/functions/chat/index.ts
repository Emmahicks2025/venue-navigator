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
- When a customer asks about an existing order, ask them for their order number (format: ORD-XXXXXX) or the email used during purchase
- If order data is provided in the context below, share the relevant details: status, event name, venue, seats, and total
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
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Convert OpenAI-style messages to Gemini format
    const geminiContents = [];
    
    for (const msg of messages) {
      if (msg.role === 'user') {
        geminiContents.push({ role: 'user', parts: [{ text: msg.content }] });
      } else if (msg.role === 'assistant' || msg.role === 'model') {
        geminiContents.push({ role: 'model', parts: [{ text: msg.content }] });
      }
    }

    // Build system prompt with order context if available
    let fullSystemPrompt = SYSTEM_PROMPT;
    if (orderContext) {
      fullSystemPrompt += `\n\n## Current Order Context\n${orderContext}`;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: fullSystemPrompt }] },
          contents: geminiContents,
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 500,
            topP: 0.95,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limited. Please try again shortly.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ error: 'AI service error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response. Please try again.";

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
