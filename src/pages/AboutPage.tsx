import { BrainCircuit, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { MarketingLayout } from '@/layouts/MarketingLayout';
import { Container } from '@/components/Container';
import { SectionTitle } from '@/components/SectionTitle';
import { Card } from '@/components/Card';

const VALUES = [
  {
    icon: BrainCircuit,
    title: 'AI-first, always',
    description: 'Every feature is built around making sense of markets faster than a human alone ever could.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust by design',
    description: 'Bank-level security and full fee transparency are non-negotiable, not an afterthought.',
  },
  {
    icon: Sparkles,
    title: 'Clarity over noise',
    description: 'We turn raw data into insights you can actually act on, without the jargon.',
  },
  {
    icon: Users,
    title: 'Built for every investor',
    description: 'From first-time traders to seasoned portfolio managers, TradeSphere scales with you.',
  },
];

export default function AboutPage() {
  return (
    <MarketingLayout>
      <Container className="py-16">
        <SectionTitle eyebrow="ABOUT" title="About TradeSphere" subtitle="We're building the AI co-pilot for modern investing." />

        <div className="mt-8 flex max-w-[720px] flex-col gap-4 text-[1rem] leading-[1.7] text-muted">
          <p>
            TradeSphere started with a simple observation: markets generate more information every day than any single investor could
            reasonably process. So we set out to build an AI-powered investment intelligence platform that reads the noise for you and
            surfaces what actually matters.
          </p>
          <p>
            Today, TradeSphere combines real-time market data with portfolio analytics, risk modeling, and a conversational AI copilot —
            all wrapped in a single dashboard designed to make confident decisions easier, not harder.
          </p>
          <p>
            We're a small team obsessed with the details of both finance and software, and we're just getting started.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, description }) => (
            <Card key={title} glass className="p-6">
              <Icon size={22} className="text-primary-text" aria-hidden />
              <h3 className="mt-3 text-[0.95rem] font-bold text-text">{title}</h3>
              <p className="mt-1.5 text-[0.85rem] leading-[1.55] text-muted">{description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </MarketingLayout>
  );
}
