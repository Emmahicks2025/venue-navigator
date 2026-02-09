import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from './ChatMessage';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const { user } = useAuth();
  const { messages, isLoading, sendMessage, sessionMode } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const msg = input;
    setInput('');
    await sendMessage(msg);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleOpen}
        className={cn(
          'fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full flex items-center justify-center',
          'bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-all duration-200',
          isOpen && 'scale-0 opacity-0 pointer-events-none'
        )}
        aria-label="Chat with us"
      >
        <MessageCircle className="w-5 h-5" />
      </button>

      {/* Minimized Bar */}
      {isOpen && isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-all text-sm font-medium"
        >
          <MessageCircle className="w-4 h-4" />
          TixOrbit Help
        </button>
      )}

      {/* Chat Panel */}
      <div className={cn(
        'fixed bottom-5 right-5 z-50 w-[340px] max-w-[calc(100vw-2rem)] rounded-xl overflow-hidden',
        'border border-border shadow-2xl flex flex-col',
        'transition-all duration-200 origin-bottom-right',
        isOpen && !isMinimized ? 'scale-100 opacity-100 h-[440px]' : 'scale-0 opacity-0 h-0 pointer-events-none'
      )}
      style={{ background: 'hsl(var(--card))' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-border bg-primary">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <MessageCircle className="w-3 h-3 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-primary-foreground">TixOrbit Help</h3>
              <p className="text-[9px] text-primary-foreground/60">
                {sessionMode === 'human' ? 'Live Agent' : 'Typically replies instantly'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setIsMinimized(true)} className="p-1 text-primary-foreground/60 hover:text-primary-foreground">
              <Minus className="w-4 h-4" />
            </button>
            <button onClick={() => setIsOpen(false)} className="p-1 text-primary-foreground/60 hover:text-primary-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 no-scrollbar">
          {!user ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2 px-3">
              <MessageCircle className="w-8 h-8 text-primary" />
              <p className="text-xs text-muted-foreground">Sign in to get help finding tickets</p>
              <Button size="sm" className="text-xs h-8" onClick={() => window.location.href = '/auth'}>
                Sign In to Chat
              </Button>
            </div>
          ) : messages.length === 0 && !isLoading ? (
            <div className="flex flex-col gap-2.5 pt-2">
              {/* Welcome message as a chat bubble */}
              <ChatMessage role="assistant" content="Hi there! 👋 Welcome to TixOrbit. How can I help you today?" />
              <div className="flex flex-wrap gap-1.5 pl-9">
                {['Look up my order', 'Find event tickets', 'World Cup 2026', 'Seating help'].map(q => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
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
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                    <Loader2 className="w-3 h-3 text-muted-foreground animate-spin" />
                  </div>
                  <div className="bg-secondary rounded-xl rounded-tl-sm px-3 py-2">
                    <div className="flex gap-1">
                      <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input */}
        {user && (
          <div className="p-2.5 border-t border-border">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-1.5">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-secondary border-0 text-xs h-8 rounded-lg"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="h-8 w-8 rounded-lg shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
