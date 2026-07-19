import { useCallback, useEffect, useState } from 'react';
import { hasSeenOnboarding, markOnboardingSeen } from '@/services/onboardingService';

export function useOnboarding() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!hasSeenOnboarding()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(true);
    }
  }, []);

  const dismiss = useCallback(() => {
    markOnboardingSeen();
    setIsOpen(false);
  }, []);

  return { isOpen, dismiss };
}
