import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/Button';
import * as workspaceService from '@/services/workspaceService';
import type { SavedReport } from '@/types';

export default function PrintableReportPage() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<SavedReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch-on-mount: synchronizing with the (mock) workspace service, the
    // textbook case for an Effect rather than derived state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    workspaceService
      .getSavedReports()
      .then((reports) => {
        setReport(reports.find((r) => r.id === id) ?? null);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <p className="py-12 text-center">Loading…</p>;
  }

  if (!report) {
    return <p className="py-12 text-center">Report not found.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="no-print mb-6 flex justify-end">
        <Button variant="primary" size="sm" onClick={() => window.print()}>
          Print / Save as PDF
        </Button>
      </div>
      <h1 className="text-2xl font-bold">{report.title}</h1>
      <p className="mt-1 text-sm text-gray-500">
        Generated {new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
      <p className="mt-6 leading-relaxed">{report.content}</p>
      <p className="mt-12 text-xs text-gray-400">TradeSphere — this report reflects mock/demo data.</p>
    </div>
  );
}
