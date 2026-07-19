import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/contexts/ToastContext';
import { AuthError, resendOtp, verifyOtp } from '@/services/authService';
import { ROUTES } from '@/constants/routes';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function VerifyOtpPage() {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email ?? 'your email';

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  function handleChange(index: number, value: string) {
    const clean = value.replace(/\D/g, '');
    if (!clean) {
      setDigits((prev) => prev.map((d, i) => (i === index ? '' : d)));
      return;
    }
    const chars = clean.split('');
    setDigits((prev) => {
      const next = [...prev];
      chars.forEach((char, offset) => {
        if (index + offset < OTP_LENGTH) next[index + offset] = char;
      });
      return next;
    });
    const nextIndex = Math.min(index + chars.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleSubmit() {
    const code = digits.join('');
    if (code.length !== OTP_LENGTH) {
      setError(`Enter all ${OTP_LENGTH} digits.`);
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await verifyOtp(code);
      showToast('success', 'Code verified', 'You can now set a new password.');
      navigate(ROUTES.resetPassword, { state: { verified: true } });
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    const { otp } = await resendOtp();
    setSecondsLeft(RESEND_SECONDS);
    setDigits(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
    showToast('info', 'New code sent', `Demo code: ${otp}`);
  }

  return (
    <div>
      <h1 className="text-[1.4rem] font-extrabold text-white">Verify your identity</h1>
      <p className="mt-1.5 text-[0.88rem] text-muted-on-dark">
        Enter the 6-digit code we sent to <span className="font-semibold text-white">{email}</span>.
      </p>

      <div className="mt-6 flex justify-between gap-2">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            inputMode="numeric"
            maxLength={OTP_LENGTH}
            aria-label={`Digit ${i + 1}`}
            className="h-14 w-full max-w-[52px] rounded-md border border-white/15 bg-white/5 text-center text-[1.3rem] font-bold text-white focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.15)] focus-visible:outline-none"
          />
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-md border border-danger/30 bg-[rgba(255,77,79,0.08)] px-3 py-2 text-[0.82rem] text-danger">
          {error}
        </p>
      )}

      <Button type="button" variant="primary" block className="mt-6" onClick={() => void handleSubmit()} disabled={isSubmitting}>
        {isSubmitting ? <Spinner size={18} /> : 'Verify Code'}
      </Button>

      <p className="mt-5 text-center text-[0.85rem] text-muted-on-dark">
        {secondsLeft > 0 ? (
          <>Resend code in {secondsLeft}s</>
        ) : (
          <button type="button" onClick={() => void handleResend()} className="font-semibold text-primary hover:opacity-80">
            Resend code
          </button>
        )}
      </p>

      <p className="mt-2 text-center text-[0.85rem] text-muted-on-dark">
        <Link to={ROUTES.login} className="hover:text-primary">
          Back to login
        </Link>
      </p>
    </div>
  );
}
