import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/contexts/ToastContext';
import { AuthError, requestPasswordReset } from '@/services/authService';
import { ROUTES } from '@/constants/routes';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const { otp } = await requestPasswordReset(email);
      showToast('info', 'Code sent', `Demo code: ${otp} (in production this would be emailed).`);
      navigate(ROUTES.verifyOtp, { state: { email } });
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-[1.4rem] font-extrabold text-white">Forgot your password?</h1>
      <p className="mt-1.5 text-[0.88rem] text-muted-on-dark">Enter your email and we'll send you a 6-digit verification code.</p>

      <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 flex flex-col gap-4">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} leadingIcon={<Mail size={16} aria-hidden />} placeholder="you@example.com" required autoComplete="email" />

        {error && (
          <p role="alert" className="rounded-md border border-danger/30 bg-[rgba(255,77,79,0.08)] px-3 py-2 text-[0.82rem] text-danger">
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" block disabled={isSubmitting}>
          {isSubmitting ? <Spinner size={18} /> : 'Send Code'}
        </Button>
      </form>

      <p className="mt-6 text-center text-[0.85rem] text-muted-on-dark">
        Remembered your password?{' '}
        <Link to={ROUTES.login} className="font-semibold text-primary hover:opacity-80">
          Log in
        </Link>
      </p>
    </div>
  );
}
