import { motion } from 'framer-motion';

const DOT_DELAYS = [0, 0.12, 0.24];

/** Three bouncing dots — shown while the AI Copilot is "typing" a reply. */
export function TypingIndicator() {
  return (
    <div className="flex w-fit max-w-[80%] items-center gap-1.5 rounded-lg bg-surface-2 px-4 py-3" aria-label="Copilot is typing" role="status">
      {DOT_DELAYS.map((delay, i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-muted"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], repeat: Infinity, delay }}
        />
      ))}
    </div>
  );
}
