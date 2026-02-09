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

let msgCounter = 0;

export function useChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionMode, setSessionMode] = useState<'ai' | 'human'>('ai');
  const [firestoreConnected, setFirestoreConnected] = useState(false);
  const unsubRef = useRef<(() => void) | null>(null);
  const unsubSessionRef = useRef<(() => void) | null>(null);

  // Try to connect to Firestore session
  const initSession = useCallback(async () => {
    if (!user) return;
    
    const sid = `chat_${user.uid}`;
    setSessionId(sid);

    try {
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

      setFirestoreConnected(true);

      // Subscribe to messages
      if (unsubRef.current) unsubRef.current();
      const messagesRef = collection(db, 'chat_sessions', sid, 'messages');
      const q = query(messagesRef, orderBy('created_at', 'asc'));
      const unsub = onSnapshot(q, (snapshot) => {
        const msgs: ChatMessage[] = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data(),
          created_at: d.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as ChatMessage));
        setMessages(msgs);
      }, () => { /* ignore subscription errors */ });
      unsubRef.current = unsub;

      // Subscribe to session mode
      if (unsubSessionRef.current) unsubSessionRef.current();
      const unsubSession = onSnapshot(sessionRef, (s) => {
        if (s.exists()) setSessionMode(s.data().mode || 'ai');
      }, () => {});
      unsubSessionRef.current = unsubSession;

    } catch {
      // Firestore unavailable — chat still works via local state + edge function
      setFirestoreConnected(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) initSession();
    return () => {
      unsubRef.current?.();
      unsubSessionRef.current?.();
    };
  }, [user, initSession]);

  const lookupOrder = async (orderNumber: string): Promise<string | null> => {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('order_number', '==', orderNumber));
      const snap = await getDocs(q);
      if (snap.empty) return null;
      
      const order = snap.docs[0].data();
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
    } catch {
      return null;
    }
  };

  const addLocalMessage = (role: ChatMessage['role'], content: string): ChatMessage => {
    const msg: ChatMessage = {
      id: `local_${++msgCounter}`,
      role,
      content,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, msg]);
    return msg;
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !user) return;
    
    // Add user message locally immediately
    addLocalMessage('user', content.trim());

    // Try to persist to Firestore (non-blocking)
    if (firestoreConnected && sessionId) {
      try {
        const messagesRef = collection(db, 'chat_sessions', sessionId, 'messages');
        await addDoc(messagesRef, { role: 'user', content: content.trim(), created_at: serverTimestamp() });
        await updateDoc(doc(db, 'chat_sessions', sessionId), { updated_at: serverTimestamp(), last_message: content.trim() });
      } catch { /* ignore persistence errors */ }
    }

    // If in human mode (admin takeover), don't call AI
    if (sessionMode === 'human') return;

    setIsLoading(true);
    try {
      const chatHistory = [...messages, { role: 'user' as const, content: content.trim() }]
        .slice(-10)
        .map(m => ({ role: m.role === 'admin' ? 'assistant' : m.role, content: m.content }));

      let orderContext: string | null = null;
      const orderMatch = content.match(/[A-Z]{2,}\d{5,}/i) || content.match(/ORD-[A-Z0-9]+/i);
      if (orderMatch) {
        orderContext = await lookupOrder(orderMatch[0]);
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
      const reply = data.reply || "Sorry, I couldn't process that. Please try again.";

      // Add AI reply locally
      if (!firestoreConnected) {
        addLocalMessage('assistant', reply);
      }

      // Persist AI reply to Firestore
      if (firestoreConnected && sessionId) {
        try {
          await addDoc(collection(db, 'chat_sessions', sessionId, 'messages'), {
            role: 'assistant', content: reply, created_at: serverTimestamp(),
          });
        } catch { /* ignore */ }
      }
    } catch (err) {
      console.error('Chat error:', err);
      addLocalMessage('assistant', "I'm having trouble connecting right now. Please try again in a moment!");
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, sessionMode, messages, firestoreConnected, user]);

  return { messages, isLoading, sendMessage, sessionId, sessionMode };
}
