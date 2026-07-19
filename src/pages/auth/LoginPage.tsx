import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/Button';
import { Spinner } from '@/components/ui/Spinner';
import { SocialAuthButtons } from '@/features/auth/SocialAuthButtons';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { AuthError } from '@/services/authService';
import { ROUTES } from '@/constants/routes';

export default function LoginPage() {
  const [email, setEmail] = useState('demo@tradesphere.app');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password, rememberMe });
      showToast('success', 'Welcome back', 'You have signed in successfully.');
      const from = (location.state as { from?: Location } | null)?.from;
      navigate(from ? `${from}` : ROUTES.overview, { replace: true });
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-[1.4rem] font-extrabold text-white">Welcome back</h1>
      <p className="mt-1.5 text-[0.88rem] text-muted-on-dark">Sign in to continue to your dashboard.</p>

      <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leadingIcon={<Mail size={16} aria-hidden />}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leadingIcon={<Lock size={16} aria-hidden />}
          placeholder="Enter your password (min. 6 characters)"
          required
          autoComplete="current-password"
          hint="Demo: any password with 6+ characters works."
        />

        {error && (
          <p role="alert" className="rounded-md border border-danger/30 bg-[rgba(255,77,79,0.08)] px-3 py-2 text-[0.82rem] text-danger">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between">
          <Checkbox label="Remember me" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
          <Link to={ROUTES.forgotPassword} className="text-[0.82rem] font-semibold text-primary hover:opacity-80">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="primary" block disabled={isSubmitting}>
          {isSubmitting ? <Spinner size={18} /> : 'Log In'}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-[0.76rem] text-muted-on-dark">or continue with</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <SocialAuthButtons />

      <p className="mt-6 text-center text-[0.85rem] text-muted-on-dark">
        Don&apos;t have an account?{' '}
        <Link to={ROUTES.register} className="font-semibold text-primary hover:opacity-80">
          Sign up
        </Link>
      </p>
    </div>
  );
}
