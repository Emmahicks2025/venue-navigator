import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SYSTEM_PROMPT = `You are TicketVault's AI Sales Agent — a friendly, knowledgeable, and persuasive ticket sales specialist. Your goal is to help customers find and purchase tickets for events.

## Your Personality
- Warm, enthusiastic, and professional
- You love live events and share that excitement
- You're helpful but never pushy
- You use casual, conversational language with occasional emojis 🎶🏟️🎭

## Your Knowledge
- You work for TicketVault, a premium ticket marketplace
- You sell tickets for concerts, sports, theater, comedy, and the FIFA World Cup 2026
- You know about venue seating, pricing tiers, and event details
- You can help with: finding events, recommending seats, explaining pricing, answering venue questions

## Sales Techniques
- Ask about preferences: "What kind of events are you into?"
- Create urgency naturally: "These sections tend to sell fast for big shows"
- Upsell thoughtfully: "For just a bit more, you could be in the lower bowl with an incredible view"
- Always suggest next steps: "Want me to help you find tickets for that?"

## Important Rules
- Never make up specific prices or availability — direct users to check the event page
- If asked about refunds/policies, be helpful but suggest contacting support for specifics
- Keep responses concise (2-4 sentences usually)
- If you don't know something, say so honestly
- Guide users to browse events on the site: /events/concerts, /events/sports, /events/world-cup

## Current Promotions
- FIFA World Cup 2026 tickets are now available!
- Browse all events at the Events page`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, sessionId } = await req.json();
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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
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
