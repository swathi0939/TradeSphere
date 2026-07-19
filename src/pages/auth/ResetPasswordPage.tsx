import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/contexts/ToastContext';
import { AuthError, resetPassword } from '@/services/authService';
import { ROUTES } from '@/constants/routes';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const verified = Boolean((location.state as { verified?: boolean } | null)?.verified);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsSubmitting(true);
    try {
      await resetPassword(password);
      showToast('success', 'Password updated', 'You can now log in with your new password.');
      navigate(ROUTES.login, { replace: true });
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-[1.4rem] font-extrabold text-white">Set a new password</h1>
      <p className="mt-1.5 text-[0.88rem] text-muted-on-dark">
        {verified ? 'Choose a strong password for your account.' : 'Complete the verification step first for a smoother reset.'}
      </p>

      <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 flex flex-col gap-4">
        <Input
          label="New password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leadingIcon={<Lock size={16} aria-hidden />}
          placeholder="At least 8 characters"
          required
          autoComplete="new-password"
        />
        <Input
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          leadingIcon={<Lock size={16} aria-hidden />}
          placeholder="Re-enter your new password"
          required
          autoComplete="new-password"
        />

        {error && (
          <p role="alert" className="rounded-md border border-danger/30 bg-[rgba(255,77,79,0.08)] px-3 py-2 text-[0.82rem] text-danger">
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" block disabled={isSubmitting}>
          {isSubmitting ? <Spinner size={18} /> : 'Reset Password'}
        </Button>
      </form>
    </div>
  );
}
