import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/Button';
import * as workspaceService from '@/services/workspaceService';
import { formatCurrency } from '@/services/mockUtils';
import type { PortfolioSnapshot } from '@/types';

export default function PrintableSnapshotPage() {
  const { id } = useParams<{ id: string }>();
  const [snapshot, setSnapshot] = useState<PortfolioSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch-on-mount: synchronizing with the (mock) workspace service, the
    // textbook case for an Effect rather than derived state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    workspaceService
      .getPortfolioSnapshots()
      .then((snapshots) => {
        setSnapshot(snapshots.find((s) => s.id === id) ?? null);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <p className="py-12 text-center">Loading…</p>;
  }

  if (!snapshot) {
    return <p className="py-12 text-center">Snapshot not found.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="no-print mb-6 flex justify-end">
        <Button variant="primary" size="sm" onClick={() => window.print()}>
          Print / Save as PDF
        </Button>
      </div>
      <h1 className="text-2xl font-bold">{snapshot.name}</h1>
      <p className="mt-1 text-sm text-gray-500">
        Generated {new Date(snapshot.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500">Total Value</p>
          <p className="text-lg font-bold">{formatCurrency(snapshot.totalValue)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Total Invested</p>
          <p className="text-lg font-bold">{formatCurrency(snapshot.totalInvested)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Holdings</p>
          <p className="text-lg font-bold">{snapshot.holdingsCount}</p>
        </div>
      </div>
      <p className="mt-12 text-xs text-gray-400">TradeSphere — this snapshot reflects mock/demo data.</p>
    </div>
  );
}
