import { Bot } from 'lucide-react';
import { useCopilot } from '@/contexts/CopilotContext';

/** Floating action button — opens/closes the global AI Copilot drawer from any dashboard page. */
export function CopilotFab() {
  const { toggle, isOpen } = useCopilot();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isOpen ? 'Close AI Copilot' : 'Open AI Copilot'}
      className="fixed bottom-6 right-6 z-[500] grid h-14 w-14 place-items-center rounded-full bg-primary text-[#04140f] shadow-lg transition-transform duration-300 ease-spring hover:scale-[1.06]"
    >
      <Bot size={26} aria-hidden />
    </button>
  );
}
