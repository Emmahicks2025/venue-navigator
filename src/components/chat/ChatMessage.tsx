import { cn } from '@/lib/utils';
import { Bot, User, ShieldCheck } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant' | 'admin';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';
  const isAdmin = role === 'admin';

  return (
    <div className={cn('flex gap-2.5 animate-fade-in', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div className={cn(
        'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center',
        isUser ? 'bg-primary' : isAdmin ? 'bg-accent' : 'bg-secondary'
      )}>
        {isUser ? <User className="w-3.5 h-3.5 text-primary-foreground" /> :
         isAdmin ? <ShieldCheck className="w-3.5 h-3.5 text-accent-foreground" /> :
         <Bot className="w-3.5 h-3.5 text-secondary-foreground" />}
      </div>
      <div className={cn(
        'max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
        isUser 
          ? 'bg-primary text-primary-foreground rounded-tr-sm' 
          : isAdmin
          ? 'bg-accent/20 text-foreground border border-accent/30 rounded-tl-sm'
          : 'bg-secondary text-foreground rounded-tl-sm'
      )}>
        {isAdmin && <span className="text-[10px] font-semibold text-accent uppercase tracking-wider block mb-1">Live Agent</span>}
        {content}
      </div>
    </div>
  );
}
