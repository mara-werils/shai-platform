import { useState } from 'react';
import { reanalyzeSOPGap } from '@/service/shai/compliance-reports';
import Toast from '@/app/components/base/toast';
import { useTranslation } from 'react-i18next';

export const useReanalyzeSOPGap = () => {
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const reanalyze = async (files: File[], originalGapId: string, generatedReportId: number, userName?: string) => {
    if (files.length === 0) {
      setError('No files selected');
      return;
    }

    try {
      setIsReanalyzing(true);
      setError(null);
      
      await reanalyzeSOPGap(files, originalGapId, generatedReportId, userName);
      
      Toast.notify({ 
        type: 'success', 
        message: t('complianceAi.reportView.reAnalyzeSuccess') 
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('complianceAi.reportView.reAnalyzeError');
      setError(errorMessage);
      Toast.notify({ 
        type: 'error', 
        message: errorMessage 
      });
      return false;
    } finally {
      setIsReanalyzing(false);
    }
  };

  return {
    reanalyze,
    isReanalyzing,
    error,
  };
};
