import { useMemo, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/ui/Input';
import { SearchBar } from '@/components/ui/SearchBar';
import type { Stock } from '@/types';
import type { WatchlistGroup } from '@/types/alerts';

interface WatchlistGroupPanelProps {
  groups: WatchlistGroup[];
  allStocks: Stock[];
  onCreateGroup: (name: string) => void;
  onDeleteGroup: (id: string) => void;
  onAddSymbol: (groupId: string, symbol: string) => void;
  onRemoveSymbol: (groupId: string, symbol: string) => void;
}

export function WatchlistGroupPanel({ groups, allStocks, onCreateGroup, onDeleteGroup, onAddSymbol, onRemoveSymbol }: WatchlistGroupPanelProps) {
  const [newGroupName, setNewGroupName] = useState('');
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  function handleCreateGroup() {
    const name = newGroupName.trim();
    if (!name) return;
    onCreateGroup(name);
    setNewGroupName('');
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <Input
          label="New group"
          placeholder="e.g. Long-term holds"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          containerClassName="flex-1"
        />
        <Button variant="primary" size="sm" onClick={handleCreateGroup} disabled={!newGroupName.trim()}>
          <Plus size={15} aria-hidden />
          Create group
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <WatchlistGroupCard
            key={group.id}
            group={group}
            allStocks={allStocks}
            isExpanded={expandedGroupId === group.id}
            query={expandedGroupId === group.id ? query : ''}
            onToggleExpand={() => {
              setExpandedGroupId((prev) => (prev === group.id ? null : group.id));
              setQuery('');
            }}
            onQueryChange={setQuery}
            onDeleteGroup={() => onDeleteGroup(group.id)}
            onAddSymbol={(symbol) => onAddSymbol(group.id, symbol)}
            onRemoveSymbol={(symbol) => onRemoveSymbol(group.id, symbol)}
          />
        ))}
      </div>
    </div>
  );
}

interface WatchlistGroupCardProps {
  group: WatchlistGroup;
  allStocks: Stock[];
  isExpanded: boolean;
  query: string;
  onToggleExpand: () => void;
  onQueryChange: (query: string) => void;
  onDeleteGroup: () => void;
  onAddSymbol: (symbol: string) => void;
  onRemoveSymbol: (symbol: string) => void;
}

function WatchlistGroupCard({
  group,
  allStocks,
  isExpanded,
  query,
  onToggleExpand,
  onQueryChange,
  onDeleteGroup,
  onAddSymbol,
  onRemoveSymbol,
}: WatchlistGroupCardProps) {
  const addableStocks = useMemo(() => {
    const list = allStocks.filter((s) => !group.symbols.includes(s.symbol));
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter((s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
  }, [allStocks, group.symbols, query]);

  return (
    <Card glass className="p-4">
      <div className="flex items-start justify-between">
        <p className="font-bold text-text">{group.name}</p>
        <button type="button" onClick={onDeleteGroup} aria-label={`Delete ${group.name} group`} className="text-muted transition-colors hover:text-danger">
          <X size={16} aria-hidden />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {group.symbols.length === 0 && <p className="text-[0.8rem] text-muted">No stocks yet.</p>}
        {group.symbols.map((symbol) => (
          <span
            key={symbol}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-2 py-1 pr-1.5 pl-3 text-[0.78rem] font-semibold text-text"
          >
            {symbol}
            <button
              type="button"
              onClick={() => onRemoveSymbol(symbol)}
              aria-label={`Remove ${symbol} from ${group.name}`}
              className="text-muted transition-colors hover:text-danger"
            >
              <X size={13} aria-hidden />
            </button>
          </span>
        ))}
      </div>

      <button type="button" onClick={onToggleExpand} className="mt-3 text-[0.8rem] font-semibold text-primary-text hover:underline">
        {isExpanded ? 'Close' : '+ Add stock'}
      </button>

      {isExpanded && (
        <div className="mt-3">
          <SearchBar value={query} onChange={onQueryChange} placeholder="Search stocks…" className="mb-2" />
          <div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
            {addableStocks.length === 0 ? (
              <p className="py-4 text-center text-[0.8rem] text-muted">No matching stocks.</p>
            ) : (
              addableStocks.map((s) => (
                <button
                  key={s.symbol}
                  type="button"
                  onClick={() => onAddSymbol(s.symbol)}
                  className="flex items-center justify-between rounded-md px-2.5 py-2 text-left transition-colors hover:bg-surface-2"
                >
                  <div>
                    <p className="text-[0.82rem] font-semibold text-text">{s.symbol}</p>
                    <p className="text-[0.72rem] text-muted">{s.name}</p>
                  </div>
                  <Plus size={15} className="text-primary" aria-hidden />
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
