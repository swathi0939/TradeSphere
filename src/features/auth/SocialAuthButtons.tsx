import { GithubIcon, GoogleIcon } from '@/components/icons/BrandIcons';
import { useToast } from '@/contexts/ToastContext';

/** "Continue with Google/GitHub" buttons — demo app, so these just surface a toast. */
export function SocialAuthButtons() {
  const { showToast } = useToast();

  function handleClick(provider: string) {
    showToast('info', `${provider} sign-in`, 'OAuth is not wired up in this demo — use the email form below.');
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => handleClick('Google')}
        className="flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-[0.86rem] font-semibold text-[#E6EDF3] transition-colors hover:border-white/30 hover:bg-white/10"
      >
        <GoogleIcon size={16} />
        Google
      </button>
      <button
        type="button"
        onClick={() => handleClick('GitHub')}
        className="flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-[0.86rem] font-semibold text-[#E6EDF3] transition-colors hover:border-white/30 hover:bg-white/10"
      >
        <GithubIcon size={16} />
        GitHub
      </button>
    </div>
  );
}
