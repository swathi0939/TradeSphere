import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/Card';

/** Temporary shim for dashboard routes not yet implemented in this build pass. */
export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <div>
      <PageHeader title={title} />
      <Card glass className="flex min-h-[240px] items-center justify-center p-8 text-center">
        <p className="text-muted">This section is being built out — check back shortly.</p>
      </Card>
    </div>
  );
}
