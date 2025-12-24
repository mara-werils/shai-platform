import { useState, useEffect } from 'react';
import { fetchGapAnalysisComparison, GapAnalysisComparisonItem } from '@/service/shai/compliance-reports';

export const useGapAnalysisComparison = (generatedReportId: number | null) => {
  const [comparison, setComparison] = useState<GapAnalysisComparisonItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComparison = async () => {
    if (!generatedReportId) {
      setComparison([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchGapAnalysisComparison(generatedReportId);
      setComparison(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch gap analysis comparison';
      setError(errorMessage);
      console.error('Error fetching gap analysis comparison:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, [generatedReportId]);

  return {
    comparison,
    loading,
    error,
    refetch: fetchComparison,
  };
};
