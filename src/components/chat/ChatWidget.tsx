import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { user } = useAuth();
  const { messages, isLoading, sendMessage, sessionMode } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const msg = input;
    setInput('');
    await sendMessage(msg);
  };

  return (
    <>
      {/* Chat Bubble */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center',
          'bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-all duration-300',
          'btn-glow',
          isOpen && 'scale-0 opacity-0 pointer-events-none'
        )}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse" />
      </button>

      {/* Chat Window */}
      <div className={cn(
        'fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden',
        'border border-border shadow-2xl flex flex-col',
        'transition-all duration-300 origin-bottom-right',
        isOpen ? 'scale-100 opacity-100 h-[550px]' : 'scale-0 opacity-0 h-0 pointer-events-none'
      )}
      style={{ background: 'hsl(var(--card))' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border"
             style={{ background: 'var(--gradient-primary)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary-foreground">TicketVault Assistant</h3>
              <p className="text-[10px] text-primary-foreground/70">
                {sessionMode === 'human' ? '🟢 Live Agent Connected' : '⚡ AI-Powered Sales Agent'}
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {!user ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 px-4">
              <Sparkles className="w-10 h-10 text-primary animate-glow-pulse" />
              <p className="text-sm text-muted-foreground">Sign in to chat with our sales agent and find the perfect tickets!</p>
              <Button size="sm" onClick={() => window.location.href = '/auth'}>
                Sign In
              </Button>
            </div>
          ) : messages.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 px-4">
              <Sparkles className="w-10 h-10 text-primary" />
              <p className="text-foreground font-semibold text-sm">Hey there! 👋</p>
              <p className="text-xs text-muted-foreground">I'm your personal ticket concierge. Ask me about events, seats, or the FIFA World Cup 2026!</p>
              <div className="flex flex-wrap gap-1.5 justify-center mt-2">
                {['🏟️ World Cup tickets', '🎵 Concert this week', '💺 Best seats?'].map(q => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-[11px] px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
              ))}
              {isLoading && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                    <Loader2 className="w-3.5 h-3.5 text-secondary-foreground animate-spin" />
                  </div>
                  <div className="bg-secondary rounded-2xl rounded-tl-sm px-3.5 py-2.5">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input */}
        {user && (
          <div className="p-3 border-t border-border">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about events, seats, pricing..."
                className="flex-1 bg-secondary border-0 text-sm h-9 rounded-xl"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="h-9 w-9 rounded-xl shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
