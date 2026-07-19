import { useState, type FormEvent } from 'react';
import { BookOpen, Mail, MessageSquare } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/Button';
import { Accordion, type AccordionItemData } from '@/components/ui/Accordion';
import { useToast } from '@/contexts/ToastContext';

const FAQ_ITEMS: AccordionItemData[] = [
  { id: 'faq-1', question: 'How do I place my first trade?', answer: 'Head to the Trading page, select a stock, choose Market or Limit, enter your quantity, and confirm the order.' },
  { id: 'faq-2', question: 'How long does KYC verification take?', answer: 'KYC is fully digital and typically completes within a few minutes once documents are submitted.' },
  { id: 'faq-3', question: 'Are there any hidden brokerage fees?', answer: 'No — all brokerage and transaction fees are shown transparently at order time before you confirm any trade.' },
  { id: 'faq-4', question: 'Can I enable two-factor authentication?', answer: 'Yes, go to Profile → Security and toggle on Two-Factor Authentication using Google Authenticator or OTP.' },
  { id: 'faq-5', question: 'How do I withdraw funds?', answer: 'Visit Portfolio → Available Balance and click Withdraw. Funds typically settle within 1-2 business days.' },
];

const DOCS = [
  { title: 'Getting started guide', description: 'Account setup, KYC, and your first deposit.' },
  { title: 'Order types explained', description: 'Market, Limit, and Stop-Loss orders in depth.' },
  { title: 'API documentation', description: 'Integrate programmatic trading with our REST API.' },
  { title: 'Charting & indicators', description: 'RSI, MACD, and Bollinger Bands reference.' },
];

export default function HelpCenterPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { showToast } = useToast();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    showToast('success', 'Message sent', "Our support team will get back to you within 24 hours.");
    setSubject('');
    setMessage('');
  }

  return (
    <div>
      <PageHeader title="Help Center" subtitle="Find answers, browse docs, or reach out to our support team." />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card glass className="p-6">
            <h3 className="mb-4 text-[0.95rem] font-bold text-text">Frequently Asked Questions</h3>
            <Accordion items={FAQ_ITEMS} />
          </Card>

          <Card glass className="mt-6 p-6">
            <div className="mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-primary" aria-hidden />
              <h3 className="text-[0.95rem] font-bold text-text">Documentation</h3>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {DOCS.map((doc) => (
                <a key={doc.title} href="#" className="rounded-md border border-border p-3.5 transition-colors hover:border-primary">
                  <p className="text-[0.86rem] font-semibold text-text">{doc.title}</p>
                  <p className="mt-1 text-[0.78rem] text-muted">{doc.description}</p>
                </a>
              ))}
            </div>
          </Card>
        </div>

        <Card glass className="h-fit p-6">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquare size={18} className="text-primary" aria-hidden />
            <h3 className="text-[0.95rem] font-bold text-text">Contact Support</h3>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What do you need help with?" required />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="support-message" className="text-[0.85rem] font-medium text-text">
                Message
              </label>
              <textarea
                id="support-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                placeholder="Describe your issue in detail…"
                className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-[0.9rem] text-text placeholder:text-muted focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.15)] focus-visible:outline-none"
              />
            </div>
            <Button type="submit" variant="primary" block>
              Send Message
            </Button>
          </form>
          <p className="mt-4 flex items-center gap-2 text-[0.78rem] text-muted">
            <Mail size={14} aria-hidden />
            Or email us at support@tradesphere.app
          </p>
        </Card>
      </div>
    </div>
  );
}
