import { useCallback, useEffect, useState } from 'react';
import * as watchlistGroupsService from '@/services/watchlistGroupsService';
import type { WatchlistGroup } from '@/types/alerts';

export function useWatchlistGroups() {
  const [groups, setGroups] = useState<WatchlistGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(() => {
    setIsLoading(true);
    watchlistGroupsService
      .getWatchlistGroups()
      .then(setGroups)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    // Fetch-on-mount: synchronizing with the (mock) watchlist-groups
    // service, the textbook case for an Effect rather than derived state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const createGroup = useCallback(async (name: string) => {
    const updated = await watchlistGroupsService.createWatchlistGroup(name);
    setGroups(updated);
  }, []);

  const deleteGroup = useCallback(async (id: string) => {
    const updated = await watchlistGroupsService.deleteWatchlistGroup(id);
    setGroups(updated);
  }, []);

  const addSymbol = useCallback(async (groupId: string, symbol: string) => {
    const updated = await watchlistGroupsService.addSymbolToGroup(groupId, symbol);
    setGroups(updated);
  }, []);

  const removeSymbol = useCallback(async (groupId: string, symbol: string) => {
    const updated = await watchlistGroupsService.removeSymbolFromGroup(groupId, symbol);
    setGroups(updated);
  }, []);

  return { groups, isLoading, createGroup, deleteGroup, addSymbol, removeSymbol };
}
