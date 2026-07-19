import { useState, type FormEvent } from 'react';
import { Clock, Mail } from 'lucide-react';
import { MarketingLayout } from '@/layouts/MarketingLayout';
import { Container } from '@/components/Container';
import { SectionTitle } from '@/components/SectionTitle';
import { Card } from '@/components/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/Button';
import { useToast } from '@/contexts/ToastContext';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { showToast } = useToast();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    showToast('success', 'Message sent', "We'll get back to you within 24 hours.");
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  }

  return (
    <MarketingLayout>
      <Container className="py-16">
        <SectionTitle eyebrow="CONTACT" title="Get in touch" subtitle="Questions, feedback, or partnership ideas — we'd love to hear from you." />

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card glass className="p-6 lg:col-span-2">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What's this about?" required />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-message" className="text-[0.85rem] font-medium text-text">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder="Tell us more…"
                  className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-[0.9rem] text-text placeholder:text-muted focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.15)] focus-visible:outline-none"
                />
              </div>
              <Button type="submit" variant="primary" block>
                Send Message
              </Button>
            </form>
          </Card>

          <Card glass className="h-fit p-6">
            <h3 className="text-[0.95rem] font-bold text-text">Other ways to reach us</h3>
            <div className="mt-4 flex items-start gap-3">
              <Mail size={18} className="mt-0.5 text-primary-text" aria-hidden />
              <div>
                <p className="text-[0.85rem] font-semibold text-text">Email</p>
                <p className="text-[0.8rem] text-muted">support@tradesphere.app</p>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3">
              <Clock size={18} className="mt-0.5 text-primary-text" aria-hidden />
              <div>
                <p className="text-[0.85rem] font-semibold text-text">Support hours</p>
                <p className="text-[0.8rem] text-muted">Mon–Fri, 9am–7pm IST</p>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </MarketingLayout>
  );
}
