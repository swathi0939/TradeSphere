import { useState } from 'react';
import { BadgeCheck, Camera, KeyRound, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import type { KycStatus } from '@/types';

const KYC_LABEL: Record<KycStatus, { label: string; variant: 'solid' | 'outline-primary' | 'outline-accent' }> = {
  verified: { label: 'Verified', variant: 'solid' },
  pending: { label: 'Pending Review', variant: 'outline-accent' },
  rejected: { label: 'Action Required', variant: 'outline-accent' },
  not_started: { label: 'Not Started', variant: 'outline-accent' },
};

export default function ProfilePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled ?? false);

  if (!user) return null;

  const kyc = KYC_LABEL[user.kycStatus];

  function handleSaveDetails() {
    showToast('success', 'Profile updated', 'Your personal details have been saved.');
  }

  function handleToggle2FA() {
    setTwoFactorEnabled((v) => !v);
    showToast('info', twoFactorEnabled ? '2FA disabled' : '2FA enabled', 'Two-factor authentication preference updated.');
  }

  return (
    <div>
      <PageHeader title="Profile" subtitle="Manage your personal details and account security." />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card glass className="flex flex-col items-center p-6 text-center xl:col-span-1">
          <div className="relative">
            <Avatar name={user.fullName} size="lg" />
            <button type="button" aria-label="Change profile photo" className="absolute -right-1 -bottom-1 grid h-7 w-7 place-items-center rounded-full bg-primary text-[#04140f]">
              <Camera size={13} aria-hidden />
            </button>
          </div>
          <p className="mt-3 text-[1.05rem] font-bold text-text">{user.fullName}</p>
          <p className="text-[0.82rem] text-muted">{user.email}</p>
          <Badge variant="outline-primary" className="mt-3">
            {user.plan} Plan
          </Badge>

          <div className="mt-5 w-full border-t border-border pt-4 text-left">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[0.82rem] text-muted">
                <BadgeCheck size={15} aria-hidden />
                KYC Status
              </span>
              <Badge variant={kyc.variant} active className="text-[0.68rem]">
                {kyc.label}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[0.82rem] text-muted">
                <ShieldCheck size={15} aria-hidden />
                PAN
              </span>
              <span className="tabular-figures text-[0.82rem] font-semibold text-text">{user.pan}</span>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-6 xl:col-span-2">
          <Card glass className="p-5">
            <h3 className="mb-4 text-[0.95rem] font-bold text-text">Personal Details</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Input label="PAN" value={user.pan} disabled hint="Contact support to update PAN details." />
            </div>
            <Button variant="primary" size="sm" className="mt-4" onClick={handleSaveDetails}>
              Save Changes
            </Button>
          </Card>

          <Card glass className="p-5">
            <h3 className="mb-4 text-[0.95rem] font-bold text-text">Security</h3>
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[rgba(var(--primary-rgb),0.1)] text-primary">
                  <KeyRound size={16} aria-hidden />
                </span>
                <div>
                  <p className="text-[0.88rem] font-semibold text-text">Password</p>
                  <p className="text-[0.78rem] text-muted">Last changed 3 months ago</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Change
              </Button>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[rgba(var(--primary-rgb),0.1)] text-primary">
                  <ShieldCheck size={16} aria-hidden />
                </span>
                <div>
                  <p className="text-[0.88rem] font-semibold text-text">Two-Factor Authentication</p>
                  <p className="text-[0.78rem] text-muted">{twoFactorEnabled ? 'Enabled via Google Authenticator' : 'Add an extra layer of security'}</p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={twoFactorEnabled}
                onClick={handleToggle2FA}
                className={`relative h-6 w-11 rounded-full transition-colors ${twoFactorEnabled ? 'bg-primary' : 'bg-border'}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${twoFactorEnabled ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </Card>

          <Card glass className="p-5">
            <h3 className="mb-4 text-[0.95rem] font-bold text-text">Linked Accounts</h3>
            <div className="flex flex-col gap-3">
              {user.linkedAccounts.map((acc) => (
                <div key={acc.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-[0.86rem] font-semibold text-text capitalize">{acc.provider}</p>
                    <p className="text-[0.78rem] text-muted">{acc.label}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Disconnect
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
