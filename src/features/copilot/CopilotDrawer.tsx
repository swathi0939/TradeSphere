import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { useCopilot } from '@/contexts/CopilotContext';
import { cn } from '@/utils/helpers';
import { TypingIndicator } from './TypingIndicator';

/** Global AI Copilot chat panel — slides in from the right, available on every dashboard page. */
export function CopilotDrawer() {
  const { messages, isOpen, isTyping, close, sendMessage } = useCopilot();
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTop = list.scrollHeight;
  }, [messages, isTyping]);

  const canSend = input.trim().length > 0 && !isTyping;

  const handleSend = () => {
    if (!canSend) return;
    const text = input;
    setInput('');
    void sendMessage(text);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Drawer open={isOpen} onClose={close} side="right" title="AI Copilot" className="flex max-w-md flex-col">
      <div ref={listRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'max-w-[80%] rounded-lg px-4 py-2.5 text-[0.88rem] leading-relaxed text-text',
              message.role === 'user' ? 'ml-auto bg-[rgba(var(--primary-rgb),0.12)]' : 'mr-auto bg-surface-2',
            )}
          >
            {message.text}
          </div>
        ))}
        {isTyping && <TypingIndicator />}
      </div>
      <div className="flex shrink-0 items-center gap-2 border-t border-border pt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about a stock, your portfolio, or the market…"
          aria-label="Message the AI Copilot"
          className="w-full flex-1 rounded-md border border-border bg-surface px-3.5 py-2.5 text-[0.88rem] text-[var(--text)] placeholder:text-[var(--text-muted)] focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.15)] focus-visible:outline-none"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary text-[#04140f] transition-opacity disabled:opacity-40"
        >
          <Send size={18} aria-hidden />
        </button>
      </div>
    </Drawer>
  );
}
