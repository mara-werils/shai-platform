import { useState, useEffect } from 'react';
import { fetchComplianceSOPs, deleteComplianceSOP, downloadComplianceSOP, uploadComplianceSOP } from '@/service/shai/compliance-sops';
import Toast from '@/app/components/base/toast';

export interface ComplianceSOP {
  id: number;
  unique_id: string;
  fileName: string;
  uploadedDate: string;
  version_number: string;
  created_by?: string;
}

export const useComplianceSOPs = (companyId: string) => {
  const [sops, setSOPs] = useState<ComplianceSOP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSOPs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchComplianceSOPs(companyId);
      setSOPs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch SOPs');
    } finally {
      setLoading(false);
    }
  };

  const deleteSOP = async (uniqueId: string) => {
    try {
      setError(null);
      await deleteComplianceSOP(uniqueId);
      await fetchSOPs(); // Обновляем список
      Toast.notify({ type: 'success', message: 'SOP successfully deleted' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete SOP';
      setError(errorMessage);
      Toast.notify({ type: 'error', message: errorMessage });
      throw err;
    }
  };

  const downloadSOP = async (uniqueId: string) => {
    try {
      setError(null);
      const downloadUrl = await downloadComplianceSOP(uniqueId);
      
      // Открываем ссылку в новой вкладке для скачивания
      window.open(downloadUrl, '_blank');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download SOP');
      throw err;
    }
  };

  const uploadSOP = async (files: File[], userName?: string) => {
    try {
      setError(null);
      await uploadComplianceSOP(files, companyId, userName);
      await fetchSOPs(); // Обновляем список
      Toast.notify({ type: 'success', message: 'SOPs successfully uploaded' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload SOPs';
      setError(errorMessage);
      Toast.notify({ type: 'error', message: errorMessage });
      throw err;
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchSOPs();
    } else {
      setLoading(false);
      setSOPs([]);
    }
  }, [companyId]);

  return {
    sops,
    loading,
    error,
    deleteSOP,
    downloadSOP,
    uploadSOP,
    refetch: fetchSOPs,
  };
}; 
