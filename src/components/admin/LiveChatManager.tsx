import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { Send, Bot, UserCheck, ArrowLeft, MessageCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Session {
  id: string;
  user_email: string | null;
  mode: 'ai' | 'human';
  last_message: string | null;
  updated_at: any;
}

interface Msg {
  id: string;
  role: 'user' | 'assistant' | 'admin';
  content: string;
  created_at: string;
}

export function LiveChatManager() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Subscribe to all chat sessions
  useEffect(() => {
    const q = query(collection(db, 'chat_sessions'), orderBy('updated_at', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setSessions(snap.docs.map(d => ({ id: d.id, ...d.data() } as Session)));
    });
    return () => unsub();
  }, []);

  // Subscribe to selected session's messages
  useEffect(() => {
    if (!selectedSession) { setMessages([]); return; }
    
    const q = query(
      collection(db, 'chat_sessions', selectedSession, 'messages'),
      orderBy('created_at', 'asc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        created_at: d.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as Msg)));
    });
    return () => unsub();
  }, [selectedSession]);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const selectedSessionData = sessions.find(s => s.id === selectedSession);

  const takeOver = async () => {
    if (!selectedSession || !user) return;
    await updateDoc(doc(db, 'chat_sessions', selectedSession), {
      mode: 'human',
      admin_id: user.uid,
      updated_at: serverTimestamp(),
    });
  };

  const releaseToAI = async () => {
    if (!selectedSession) return;
    await updateDoc(doc(db, 'chat_sessions', selectedSession), {
      mode: 'ai',
      admin_id: null,
      updated_at: serverTimestamp(),
    });
  };

  const sendAdminMessage = async () => {
    if (!selectedSession || !input.trim() || sending) return;
    setSending(true);
    try {
      await addDoc(collection(db, 'chat_sessions', selectedSession, 'messages'), {
        role: 'admin',
        content: input.trim(),
        created_at: serverTimestamp(),
      });
      await updateDoc(doc(db, 'chat_sessions', selectedSession), {
        updated_at: serverTimestamp(),
        last_message: `[Admin] ${input.trim()}`,
      });
      setInput('');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
      {/* Sessions List */}
      <div className={cn(
        'border border-border rounded-xl overflow-hidden flex flex-col',
        selectedSession && 'hidden lg:flex'
      )}
      style={{ background: 'hsl(var(--card))' }}
      >
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Active Chats ({sessions.length})
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">No active chats</p>
          ) : (
            sessions.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedSession(s.id)}
                className={cn(
                  'w-full text-left px-4 py-3 border-b border-border hover:bg-secondary/50 transition-colors',
                  selectedSession === s.id && 'bg-secondary'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground truncate">
                    {s.user_email || 'Anonymous'}
                  </span>
                  <Badge variant={s.mode === 'human' ? 'default' : 'secondary'} className="text-[10px] shrink-0">
                    {s.mode === 'human' ? 'Live' : 'AI'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{s.last_message || 'No messages'}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat View */}
      <div className={cn(
        'lg:col-span-2 border border-border rounded-xl overflow-hidden flex flex-col',
        !selectedSession && 'hidden lg:flex'
      )}
      style={{ background: 'hsl(var(--card))' }}
      >
        {!selectedSession ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            Select a chat to view
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedSession(null)} className="lg:hidden text-muted-foreground">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <p className="text-sm font-semibold text-foreground">{selectedSessionData?.user_email || 'Anonymous'}</p>
                  <p className="text-[10px] text-muted-foreground">
                    Mode: {selectedSessionData?.mode === 'human' ? '🟢 Live Agent' : '🤖 AI'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {selectedSessionData?.mode === 'ai' ? (
                  <Button size="sm" variant="default" onClick={takeOver} className="gap-1.5 text-xs">
                    <UserCheck className="w-3.5 h-3.5" /> Take Over
                  </Button>
                ) : (
                  <Button size="sm" variant="secondary" onClick={releaseToAI} className="gap-1.5 text-xs">
                    <Bot className="w-3.5 h-3.5" /> Release to AI
                  </Button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
              {messages.map(msg => (
                <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
              ))}
            </div>

            {/* Admin Input */}
            {selectedSessionData?.mode === 'human' && (
              <div className="p-3 border-t border-border">
                <form onSubmit={(e) => { e.preventDefault(); sendAdminMessage(); }} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type as admin..."
                    className="flex-1 bg-secondary border-0 text-sm h-9 rounded-xl"
                    disabled={sending}
                  />
                  <Button type="submit" size="icon" disabled={!input.trim() || sending} className="h-9 w-9 rounded-xl">
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
