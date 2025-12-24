import { useState, useEffect } from 'react';
import { fetchComplianceStandards, uploadComplianceStandard, deleteComplianceStandard, downloadComplianceStandard } from '@/service/shai/compliance-standards';
import Toast from '@/app/components/base/toast';

export interface ComplianceStandard {
  id: number;
  unique_id: string;
  fileName: string;
  uploadedDate: string;
  created_by?: string;
}

export const useComplianceStandards = (companyId: string) => {
  const [standards, setStandards] = useState<ComplianceStandard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStandards = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchComplianceStandards(companyId);
      setStandards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch standards');
    } finally {
      setLoading(false);
    }
  };

  const uploadStandard = async (files: File[], userName?: string) => {
    try {
      setError(null);
      await uploadComplianceStandard(files, companyId, userName);
      await fetchStandards();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload standard');
      throw err;
    }
  };

  const deleteStandard = async (uniqueId: string) => {
    try {
      setError(null);
      await deleteComplianceStandard(uniqueId);
      await fetchStandards();
      Toast.notify({ type: 'success', message: 'Standard successfully deleted' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete standard';
      setError(errorMessage);
      Toast.notify({ type: 'error', message: errorMessage });
      throw err;
    }
  };

  const downloadStandard = async (uniqueId: string) => {
    try {
      setError(null);
      const downloadUrl = await downloadComplianceStandard(uniqueId);

      window.open(downloadUrl, '_blank');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download standard');
      throw err;
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchStandards();
    } else {
      setLoading(false);
      setStandards([]);
    }
  }, [companyId]);

  return {
    standards,
    loading,
    error,
    uploadStandard,
    deleteStandard,
    downloadStandard,
    refetch: fetchStandards,
  };
}; 
