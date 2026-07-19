import { useRef, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Download, Printer, Save, Share2, Sparkles, Trash2, Upload } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Input } from '@/components/ui/Input';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { Table } from '@/components/ui/Table';
import { SkeletonCard, SkeletonText } from '@/components/ui/Skeleton';
import { useWorkspace } from '@/store/useWorkspace';
import { useToast } from '@/contexts/ToastContext';
import * as portfolioService from '@/services/portfolioService';
import { parseCsv, toCsv, type ParsedCsvRow } from '@/features/workspace/csv';
import { formatCurrency } from '@/services/mockUtils';
import { buildReportPrintPath, buildSnapshotPrintPath } from '@/constants/routes';
import type { SavedReportType, TableColumn } from '@/types';

const REPORT_TYPE_LABEL: Record<SavedReportType, string> = {
  dailyBrief: 'Daily Brief',
  portfolioDiagnosis: 'Portfolio Diagnosis',
  wealthForecast: 'Wealth Forecast',
  stressTest: 'Stress Test',
};

const REPORT_TYPE_OPTIONS = Object.entries(REPORT_TYPE_LABEL).map(([value, label]) => ({
  value: value as SavedReportType,
  label,
}));

const IMPORT_COLUMNS: TableColumn<ParsedCsvRow>[] = [
  { key: 'symbol', header: 'Symbol', render: (row) => <span className="font-semibold">{row.symbol}</span> },
  { key: 'quantity', header: 'Quantity', align: 'right', render: (row) => row.quantity },
  { key: 'avgPrice', header: 'Avg Price', align: 'right', render: (row) => formatCurrency(row.avgPrice) },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (row) => (
      <Badge variant={row.matched ? 'outline-primary' : 'outline-accent'}>{row.matched ? 'Matched' : 'Unmatched'}</Badge>
    ),
  },
];

export default function WorkspacePage() {
  const { snapshots, isLoadingSnapshots, saveSnapshot, deleteSnapshot, reports, isLoadingReports, saveReport, deleteReport } =
    useWorkspace();
  const { showToast } = useToast();

  const [snapshotName, setSnapshotName] = useState('');
  const [isSavingSnapshot, setIsSavingSnapshot] = useState(false);

  const [selectedReportType, setSelectedReportType] = useState<SavedReportType>('dailyBrief');
  const [isSavingReport, setIsSavingReport] = useState(false);

  const [isExporting, setIsExporting] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedCsvRow[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSaveSnapshot() {
    const trimmed = snapshotName.trim();
    if (!trimmed) return;
    setIsSavingSnapshot(true);
    try {
      await saveSnapshot(trimmed);
      setSnapshotName('');
    } finally {
      setIsSavingSnapshot(false);
    }
  }

  async function handleGenerateReport() {
    setIsSavingReport(true);
    try {
      await saveReport(selectedReportType);
    } finally {
      setIsSavingReport(false);
    }
  }

  async function handleExport() {
    setIsExporting(true);
    try {
      const holdings = await portfolioService.getHoldings();
      const csv = toCsv(holdings);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'holdings.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const text = await file.text();
    setParsedRows(parseCsv(text));
  }

  async function handleShare(title: string, text: string) {
    if (navigator.share) {
      try {
        await navigator.share({ title, text });
      } catch {
        // user cancelled the share sheet — not an error
      }
    } else {
      await navigator.clipboard.writeText(`${title}\n\n${text}`);
      showToast('info', 'Copied to clipboard', 'Share text has been copied — paste it anywhere.');
    }
  }

  return (
    <div>
      <PageHeader title="My Workspace" subtitle="Saved portfolio snapshots, saved AI reports, and CSV import/export." />

      <ChartWrapper
        title="Portfolio Snapshots"
        subtitle="Save a point-in-time snapshot of your portfolio to compare later."
        actions={
          <div className="flex items-center gap-2">
            <Input
              value={snapshotName}
              onChange={(e) => setSnapshotName(e.target.value)}
              placeholder="Snapshot name"
              containerClassName="w-40 sm:w-52"
            />
            <Button variant="primary" size="sm" onClick={() => void handleSaveSnapshot()} disabled={!snapshotName.trim() || isSavingSnapshot}>
              <Save size={15} aria-hidden />
              Save Snapshot
            </Button>
          </div>
        }
      >
        {isLoadingSnapshots ? (
          <SkeletonText lines={3} />
        ) : snapshots.length === 0 ? (
          <p className="py-4 text-center text-[0.85rem] text-muted">No snapshots saved yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {snapshots.map((snap) => (
              <div key={snap.id} className="flex items-center justify-between rounded-md border border-border px-3.5 py-2.5">
                <div>
                  <p className="text-[0.86rem] font-semibold text-text">{snap.name}</p>
                  <p className="text-[0.76rem] text-muted">
                    {formatCurrency(snap.totalValue)} · {snap.holdingsCount} holding{snap.holdingsCount === 1 ? '' : 's'} ·{' '}
                    {new Date(snap.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Link
                    to={buildSnapshotPrintPath(snap.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Print snapshot ${snap.name}`}
                    className="text-muted transition-colors hover:text-primary-text"
                  >
                    <Printer size={15} aria-hidden />
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      void handleShare(
                        snap.name,
                        `${formatCurrency(snap.totalValue)} across ${snap.holdingsCount} holdings, saved ${new Date(snap.createdAt).toLocaleDateString('en-IN')}.`,
                      )
                    }
                    aria-label={`Share snapshot ${snap.name}`}
                    className="text-muted transition-colors hover:text-primary-text"
                  >
                    <Share2 size={15} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteSnapshot(snap.id)}
                    aria-label={`Delete snapshot ${snap.name}`}
                    className="text-muted transition-colors hover:text-danger"
                  >
                    <Trash2 size={15} aria-hidden />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ChartWrapper>

      <ChartWrapper
        title="Saved AI Reports"
        subtitle="Generate a report from your current data and save it for later."
        className="mt-6"
        actions={
          <div className="flex items-center gap-2">
            <Dropdown
              align="left"
              trigger={({ toggle }) => (
                <button
                  type="button"
                  onClick={toggle}
                  className="flex items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 py-2 text-[0.85rem] font-medium text-text transition-colors hover:border-primary/40"
                >
                  {REPORT_TYPE_LABEL[selectedReportType]}
                  <ChevronDown size={16} className="text-muted" aria-hidden />
                </button>
              )}
            >
              {REPORT_TYPE_OPTIONS.map((opt) => (
                <DropdownItem key={opt.value} onClick={() => setSelectedReportType(opt.value)}>
                  {opt.label}
                </DropdownItem>
              ))}
            </Dropdown>
            <Button variant="primary" size="sm" onClick={() => void handleGenerateReport()} disabled={isSavingReport}>
              <Sparkles size={15} aria-hidden />
              {isSavingReport ? 'Generating…' : 'Generate & Save'}
            </Button>
          </div>
        }
      >
        {isLoadingReports ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : reports.length === 0 ? (
          <p className="py-4 text-center text-[0.85rem] text-muted">No saved reports yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {reports.map((report) => (
              <Card key={report.id} className="flex flex-col gap-2 border border-border p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-text">{report.title}</p>
                  <div className="flex shrink-0 items-center gap-3">
                    <Link
                      to={buildReportPrintPath(report.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Print report ${report.title}`}
                      className="text-muted transition-colors hover:text-primary-text"
                    >
                      <Printer size={15} aria-hidden />
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleShare(report.title, report.content)}
                      aria-label={`Share report ${report.title}`}
                      className="text-muted transition-colors hover:text-primary-text"
                    >
                      <Share2 size={15} aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteReport(report.id)}
                      aria-label={`Delete report ${report.title}`}
                      className="text-muted transition-colors hover:text-danger"
                    >
                      <Trash2 size={15} aria-hidden />
                    </button>
                  </div>
                </div>
                <p className="line-clamp-3 text-[0.82rem] text-muted">{report.content}</p>
                <p className="mt-1 text-[0.72rem] text-muted">{new Date(report.createdAt).toLocaleDateString('en-IN')}</p>
              </Card>
            ))}
          </div>
        )}
      </ChartWrapper>

      <ChartWrapper title="CSV Import / Export" subtitle="Export your current holdings, or preview importing holdings from a CSV file." className="mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="sm" onClick={() => void handleExport()} disabled={isExporting}>
            <Download size={15} aria-hidden />
            Export Holdings (CSV)
          </Button>
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={(e) => void handleFileChange(e)} />
          <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload size={15} aria-hidden />
            Choose File
          </Button>
        </div>

        <p className="mt-3 text-[0.78rem] text-muted">Preview only — imported holdings are not yet applied to your live portfolio.</p>

        {parsedRows && (
          <div className="mt-4">
            <Table
              columns={IMPORT_COLUMNS}
              data={parsedRows}
              keyField={(row) => `${row.symbol}-${parsedRows.indexOf(row)}`}
              emptyMessage="No rows found in that file."
            />
          </div>
        )}
      </ChartWrapper>
    </div>
  );
}
