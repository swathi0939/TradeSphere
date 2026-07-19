import { useCallback, useEffect, useState } from 'react';
import * as workspaceService from '@/services/workspaceService';
import type { PortfolioSnapshot, SavedReport, SavedReportType } from '@/types';

export function useWorkspace() {
  const [snapshots, setSnapshots] = useState<PortfolioSnapshot[]>([]);
  const [isLoadingSnapshots, setIsLoadingSnapshots] = useState(true);
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);

  const loadSnapshots = useCallback(() => {
    setIsLoadingSnapshots(true);
    workspaceService
      .getPortfolioSnapshots()
      .then(setSnapshots)
      .finally(() => setIsLoadingSnapshots(false));
  }, []);

  const loadReports = useCallback(() => {
    setIsLoadingReports(true);
    workspaceService
      .getSavedReports()
      .then(setReports)
      .finally(() => setIsLoadingReports(false));
  }, []);

  useEffect(() => {
    // Fetch-on-mount: synchronizing with the (mock) workspace service,
    // the textbook case for an Effect rather than derived state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSnapshots();
    loadReports();
  }, [loadSnapshots, loadReports]);

  const saveSnapshot = useCallback(async (name: string) => {
    const updated = await workspaceService.savePortfolioSnapshot(name);
    setSnapshots(updated);
  }, []);

  const deleteSnapshot = useCallback(async (id: string) => {
    const updated = await workspaceService.deletePortfolioSnapshot(id);
    setSnapshots(updated);
  }, []);

  const saveReport = useCallback(async (type: SavedReportType) => {
    const updated = await workspaceService.saveReport(type);
    setReports(updated);
  }, []);

  const deleteReport = useCallback(async (id: string) => {
    const updated = await workspaceService.deleteReport(id);
    setReports(updated);
  }, []);

  return { snapshots, isLoadingSnapshots, saveSnapshot, deleteSnapshot, reports, isLoadingReports, saveReport, deleteReport };
}
