import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import * as copilotService from '@/services/copilotService';
import { generateId } from '@/services/mockUtils';
import type { CopilotMessage } from '@/types/copilot';

interface CopilotContextValue {
  messages: CopilotMessage[];
  isOpen: boolean;
  isTyping: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  sendMessage: (text: string) => Promise<void>;
}

const WELCOME_MESSAGE: CopilotMessage = {
  id: generateId('copilot'),
  role: 'assistant',
  text: "Hi! I'm your AI Copilot. Ask me about a stock, your portfolio, or the market.",
  timestamp: new Date().toISOString(),
};

const CopilotContext = createContext<CopilotContextValue | null>(null);

export function CopilotProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<CopilotMessage[]>([WELCOME_MESSAGE]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: CopilotMessage = {
      id: generateId('copilot'),
      role: 'user',
      text: trimmed,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const reply = await copilotService.getResponse(trimmed);

    const assistantMessage: CopilotMessage = {
      id: generateId('copilot'),
      role: 'assistant',
      text: reply,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  }, []);

  const value = useMemo<CopilotContextValue>(
    () => ({ messages, isOpen, isTyping, open, close, toggle, sendMessage }),
    [messages, isOpen, isTyping, open, close, toggle, sendMessage],
  );

  return <CopilotContext.Provider value={value}>{children}</CopilotContext.Provider>;
}

export function useCopilot(): CopilotContextValue {
  const ctx = useContext(CopilotContext);
  if (!ctx) throw new Error('useCopilot must be used within a CopilotProvider');
  return ctx;
}
