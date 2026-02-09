import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, doc, addDoc, onSnapshot, query, orderBy, updateDoc, serverTimestamp, setDoc, getDoc, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './useAuth';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'admin';
  content: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  mode: 'ai' | 'human';
  user_email: string | null;
  admin_id: string | null;
  created_at: any;
  updated_at: any;
  last_message: string | null;
}

export function useChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionMode, setSessionMode] = useState<'ai' | 'human'>('ai');
  const unsubRef = useRef<(() => void) | null>(null);

  // Get or create session
  const getOrCreateSession = useCallback(async () => {
    if (!user) return null;
    
    const sid = `chat_${user.uid}`;
    const sessionRef = doc(db, 'chat_sessions', sid);
    const snap = await getDoc(sessionRef);
    
    if (!snap.exists()) {
      await setDoc(sessionRef, {
        user_id: user.uid,
        user_email: user.email,
        mode: 'ai',
        admin_id: null,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        last_message: null,
      });
    } else {
      setSessionMode(snap.data().mode || 'ai');
    }
    
    setSessionId(sid);
    return sid;
  }, [user]);

  // Subscribe to messages
  useEffect(() => {
    if (!sessionId) return;
    
    if (unsubRef.current) unsubRef.current();

    const messagesRef = collection(db, 'chat_sessions', sessionId, 'messages');
    const q = query(messagesRef, orderBy('created_at', 'asc'));
    
    const unsub = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        created_at: d.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as ChatMessage));
      setMessages(msgs);
    });

    unsubRef.current = unsub;
    return () => unsub();
  }, [sessionId]);

  // Subscribe to session mode changes
  useEffect(() => {
    if (!sessionId) return;
    
    const sessionRef = doc(db, 'chat_sessions', sessionId);
    const unsub = onSnapshot(sessionRef, (snap) => {
      if (snap.exists()) {
        setSessionMode(snap.data().mode || 'ai');
      }
    });
    return () => unsub();
  }, [sessionId]);

  // Initialize session
  useEffect(() => {
    if (user) getOrCreateSession();
  }, [user, getOrCreateSession]);

  const lookupOrder = async (orderNumber: string): Promise<string | null> => {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('order_number', '==', orderNumber));
      const snap = await getDocs(q);
      if (snap.empty) return null;
      
      const order = snap.docs[0].data();
      // Look up tickets for this order
      const ticketsRef = collection(db, 'tickets');
      const tq = query(ticketsRef, where('order_id', '==', snap.docs[0].id));
      const tSnap = await getDocs(tq);
      const tickets = tSnap.docs.map(d => d.data());
      
      let context = `Order #${order.order_number} — Status: ${order.status}, Total: $${order.total}`;
      if (order.billing_email) context += `, Email: ${order.billing_email}`;
      if (tickets.length > 0) {
        context += `\nTickets (${tickets.length}):`;
        tickets.forEach((t: any) => {
          context += `\n- ${t.event_name} at ${t.venue_name}, ${t.section_name} Row ${t.row_name} Seat ${t.seat_number} ($${t.price})`;
        });
      }
      return context;
    } catch (e) {
      console.error('Order lookup error:', e);
      return null;
    }
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!sessionId || !content.trim()) return;
    
    const messagesRef = collection(db, 'chat_sessions', sessionId, 'messages');
    
    // Add user message to Firestore
    await addDoc(messagesRef, {
      role: 'user',
      content: content.trim(),
      created_at: serverTimestamp(),
    });

    // Update session
    await updateDoc(doc(db, 'chat_sessions', sessionId), {
      updated_at: serverTimestamp(),
      last_message: content.trim(),
    });

    // If AI mode, get AI response
    if (sessionMode === 'ai') {
      setIsLoading(true);
      try {
        const chatHistory = [...messages, { role: 'user' as const, content: content.trim() }]
          .slice(-10)
          .map(m => ({ role: m.role === 'admin' ? 'assistant' : m.role, content: m.content }));

        // Check if any recent message contains an order number pattern
        let orderContext: string | null = null;
        const orderMatch = content.match(/ORD-[A-Z0-9]+/i);
        if (orderMatch) {
          orderContext = await lookupOrder(orderMatch[0].toUpperCase());
        }

        const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
        const resp = await fetch(CHAT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: chatHistory, sessionId, orderContext }),
        });

        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to get response');
        }

        const data = await resp.json();
        
        // Add AI response to Firestore
        await addDoc(messagesRef, {
          role: 'assistant',
          content: data.reply,
          created_at: serverTimestamp(),
        });
      } catch (err) {
        console.error('Chat error:', err);
        await addDoc(messagesRef, {
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please try again in a moment! 🙏",
          created_at: serverTimestamp(),
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [sessionId, sessionMode, messages]);

  return { messages, isLoading, sendMessage, sessionId, sessionMode };
}
