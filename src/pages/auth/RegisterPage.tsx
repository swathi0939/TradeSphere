import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Phone, User } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/Button';
import { Spinner } from '@/components/ui/Spinner';
import { SocialAuthButtons } from '@/features/auth/SocialAuthButtons';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { AuthError } from '@/services/authService';
import { ROUTES } from '@/constants/routes';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register({ fullName, email, phone, password, confirmPassword, acceptTerms });
      showToast('success', 'Account created', 'Welcome to TradeSphere! Let’s get your KYC verified.');
      navigate(ROUTES.overview, { replace: true });
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-[1.4rem] font-extrabold text-white">Create your account</h1>
      <p className="mt-1.5 text-[0.88rem] text-muted-on-dark">Start trading in minutes — no paperwork.</p>

      <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 flex flex-col gap-4">
        <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} leadingIcon={<User size={16} aria-hidden />} placeholder="Ananya Rao" required autoComplete="name" />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} leadingIcon={<Mail size={16} aria-hidden />} placeholder="you@example.com" required autoComplete="email" />
        <Input label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} leadingIcon={<Phone size={16} aria-hidden />} placeholder="+91 98765 43210" required autoComplete="tel" />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leadingIcon={<Lock size={16} aria-hidden />}
          placeholder="Create a password"
          required
          autoComplete="new-password"
        />
        <Input
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          leadingIcon={<Lock size={16} aria-hidden />}
          placeholder="Re-enter your password"
          required
          autoComplete="new-password"
        />

        {error && (
          <p role="alert" className="rounded-md border border-danger/30 bg-[rgba(255,77,79,0.08)] px-3 py-2 text-[0.82rem] text-danger">
            {error}
          </p>
        )}

        <Checkbox
          label={
            <span>
              I agree to the <Link to="#" className="font-semibold text-primary hover:opacity-80">Terms of Service</Link> and{' '}
              <Link to="#" className="font-semibold text-primary hover:opacity-80">Privacy Policy</Link>
            </span>
          }
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          required
        />

        <Button type="submit" variant="primary" block disabled={isSubmitting}>
          {isSubmitting ? <Spinner size={18} /> : 'Create Account'}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-[0.76rem] text-muted-on-dark">or continue with</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <SocialAuthButtons />

      <p className="mt-6 text-center text-[0.85rem] text-muted-on-dark">
        Already have an account?{' '}
        <Link to={ROUTES.login} className="font-semibold text-primary hover:opacity-80">
          Log in
        </Link>
      </p>
    </div>
  );
}
