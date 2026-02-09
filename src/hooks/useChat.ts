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

const AGENT_NAMES = [
  'Maria', 'Carlos', 'Sofia', 'Diego', 'Isabella', 'Alejandro',
  'Gabriela', 'Miguel', 'Valentina', 'Andres', 'Camila', 'Lucas',
  'Emily', 'James', 'Sarah', 'Michael', 'Jessica', 'David',
  'Ashley', 'Daniel', 'Amanda', 'Brandon', 'Nicole', 'Ryan',
];

const getRandomAgentName = () => AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)];

let msgCounter = 0;

export function useChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionMode, setSessionMode] = useState<'ai' | 'human'>('ai');
  const [firestoreConnected, setFirestoreConnected] = useState(false);
  const [agentName] = useState(() => getRandomAgentName());
  const [isTyping, setIsTyping] = useState(false);
  const typingRef = useRef<NodeJS.Timeout | null>(null);
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
      console.log('[Chat] Looking up order:', orderNumber);
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('order_number', '==', orderNumber));
      const snap = await getDocs(q);
      console.log('[Chat] Order query result:', snap.size, 'docs found');
      if (snap.empty) {
        const q2 = query(ordersRef, where('order_number', '==', orderNumber.toUpperCase()));
        const snap2 = await getDocs(q2);
        console.log('[Chat] Uppercase retry:', snap2.size, 'docs found');
        if (snap2.empty) return null;
        return buildOrderContext(snap2.docs[0]);
      }
      return buildOrderContext(snap.docs[0]);
    } catch (err) {
      console.error('[Chat] Order lookup error:', err);
      return null;
    }
  };

  const lookupOrderByEmail = async (email: string): Promise<string | null> => {
    try {
      console.log('[Chat] Looking up orders by email:', email);
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('billing_email', '==', email.toLowerCase()));
      const snap = await getDocs(q);
      console.log('[Chat] Email query result:', snap.size, 'docs found');
      if (snap.empty) return null;
      const contexts = await Promise.all(snap.docs.map(d => buildOrderContext(d)));
      return contexts.join('\n\n');
    } catch (err) {
      console.error('[Chat] Email order lookup error:', err);
      return null;
    }
  };

  const buildOrderContext = async (orderDoc: any): Promise<string> => {
    const order = orderDoc.data();
    const ticketsRef = collection(db, 'tickets');
    const tq = query(ticketsRef, where('order_id', '==', orderDoc.id));
    const tSnap = await getDocs(tq);
    console.log('[Chat] Tickets for order:', tSnap.size);
    const tickets = tSnap.docs.map(d => d.data());
    
    let context = `Order #${order.order_number} — Status: ${order.status}, Total: $${order.total}`;
    if (order.billing_email) context += `, Email: ${order.billing_email}`;
    if (order.remarks) context += `\nAdmin Remarks/Instructions: ${order.remarks}`;
    if (tickets.length > 0) {
      context += `\nTickets (${tickets.length}):`;
      tickets.forEach((t: any) => {
        context += `\n- ${t.event_name} at ${t.venue_name}, ${t.section_name} Row ${t.row_name} Seat ${t.seat_number} ($${t.price})`;
        if (t.remarks) context += ` [Note: ${t.remarks}]`;
      });
    }
    return context;
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
      // Match TO or TV prefix (TV was legacy format)
      const orderMatch = content.match(/T[OV]\d{5,}/i) || content.match(/ORD-[A-Z0-9]+/i);
      if (orderMatch) {
        orderContext = await lookupOrder(orderMatch[0]);
      }
      // Also try email-based lookup
      if (!orderContext) {
        const emailMatch = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (emailMatch) {
          orderContext = await lookupOrderByEmail(emailMatch[0]);
        }
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

      // Show full reply at once (delay is handled on backend)
      setIsLoading(false);

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

  const resetSession = useCallback(() => {
    // Unsubscribe from current session
    unsubRef.current?.();
    unsubSessionRef.current?.();
    unsubRef.current = null;
    unsubSessionRef.current = null;
    
    // Clear local state
    setMessages([]);
    setSessionId(null);
    setSessionMode('ai');
    setFirestoreConnected(false);
    msgCounter = 0;
    
    // Re-initialize with a new session ID
    if (user) {
      const newSid = `chat_${user.uid}_${Date.now()}`;
      setSessionId(newSid);
      
      // Create new Firestore session
      const sessionRef = doc(db, 'chat_sessions', newSid);
      setDoc(sessionRef, {
        user_id: user.uid,
        user_email: user.email,
        mode: 'ai',
        admin_id: null,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        last_message: null,
      }).then(() => {
        setFirestoreConnected(true);
        
        // Subscribe to messages
        const messagesRef = collection(db, 'chat_sessions', newSid, 'messages');
        const q = query(messagesRef, orderBy('created_at', 'asc'));
        unsubRef.current = onSnapshot(q, (snapshot) => {
          setMessages(snapshot.docs.map(d => ({
            id: d.id,
            ...d.data(),
            created_at: d.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
          } as ChatMessage)));
        }, () => {});
        
        // Subscribe to session mode
        unsubSessionRef.current = onSnapshot(sessionRef, (s) => {
          if (s.exists()) setSessionMode(s.data().mode || 'ai');
        }, () => {});
      }).catch(() => {
        setFirestoreConnected(false);
      });
    }
  }, [user]);

  return { messages, isLoading, isTyping, sendMessage, sessionId, sessionMode, resetSession, agentName };
}
