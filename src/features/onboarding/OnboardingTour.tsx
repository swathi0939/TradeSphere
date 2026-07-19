import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/Button';
import { cn } from '@/utils/helpers';

interface OnboardingTourProps {
  open: boolean;
  onDismiss: () => void;
}

const STEPS = [
  {
    title: 'Welcome to TradeSphere',
    body: "Let's take a quick look at what your new AI-powered investing dashboard can do.",
  },
  {
    title: 'Track Your Portfolio',
    body: 'Head to Portfolio, Holdings, and Analytics to see performance and allocation at a glance.',
  },
  {
    title: 'AI-Powered Insights',
    body: 'Portfolio Doctor, AI Insights, and Strategy Builder surface opportunities and risks automatically.',
  },
  {
    title: 'Stay in the Loop',
    body: 'Smart Alerts and Notifications keep you updated, and the Copilot chat FAB is always one click away.',
  },
];

/** Presentational 4-step welcome tour. Mount point + `useOnboarding()` ownership live with the caller. */
export function OnboardingTour({ open, onDismiss }: OnboardingTourProps) {
  const [step, setStep] = useState(0);
  const isLastStep = step === STEPS.length - 1;
  const current = STEPS[step] ?? STEPS[0]!;

  function handleNext() {
    if (isLastStep) {
      onDismiss();
      return;
    }
    setStep((s) => s + 1);
  }

  return (
    <Modal open={open} onClose={onDismiss} title={current.title}>
      <p className="text-[0.92rem] leading-[1.6] text-muted">{current.body}</p>

      <div className="mt-6 flex items-center justify-center gap-2">
        {STEPS.map((s, i) => (
          <span key={s.title} className={cn('h-1.5 w-1.5 rounded-full', i === step ? 'bg-primary' : 'bg-border')} aria-hidden="true" />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
          Back
        </Button>
        <Button variant="primary" size="sm" onClick={handleNext}>
          {isLastStep ? 'Get Started' : 'Next'}
        </Button>
      </div>
    </Modal>
  );
}
