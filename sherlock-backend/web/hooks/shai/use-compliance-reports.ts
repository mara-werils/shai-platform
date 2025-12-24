import { useState, useEffect } from 'react';
import { 
  fetchComplianceReports, 
  deleteComplianceReport,
  renameComplianceReport,
  fetchComplianceReport,
  createComplianceReportWithExistingGuidelines,
  downloadExecutiveSummaryReport,
  downloadSOPReport
} from '@/service/shai/compliance-reports';
import Toast from '@/app/components/base/toast';

export interface ComplianceReport {
  generated_report_id: number;
  invocation_id: string;
  dag_run_id: string;
  guidelines_type: string;
  report_name?: string;
  created_at: string;
  processing_status: string;
  version?: string | number;
  created_by?: string;
  json_content?: {
    ExecutiveSummary: {
      Overview: string;
      CriticalGaps?: {
        GapDescription: string;
        RecommendedActions: string[];
      }[];
    };
    recommended_actions: string[];
    RegulationCoverageGaps: {
      CoverageStatus: string;
      GapDescription: string;
      Impact: string;
      RegulationSection: string;
    }[];
    sop_specific_gaps: {
      gap_description: string;
      regulation_section: string;
      severity: string;
      sop_name: string;
      markdown_content: string;
    }[];


    kpimetrics?: {
      clauses: number;
      coverage_percentage: number;
      gaps: number;
      sops: number;
      sops_which_needs_corrective_actions: number;
    };
  };
}

export const useComplianceReports = (companyId: string) => {
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchComplianceReports(companyId);
      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (generatedReportId: number) => {
    try {
      setError(null);
      await deleteComplianceReport(generatedReportId);

      await fetchReports();
      Toast.notify({ type: 'success', message: 'Report successfully deleted' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete report';
      setError(errorMessage);
      Toast.notify({ type: 'error', message: errorMessage });
      throw err;
    }
  };

  const renameReport = async (id: number, report_name: string) => {
    try {
      setError(null);
      await renameComplianceReport(id, report_name, companyId);

      await fetchReports();
      Toast.notify({ type: 'success', message: 'Report successfully renamed' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to rename report';
      setError(errorMessage);
      Toast.notify({ type: 'error', message: errorMessage });
      throw err;
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchReports();
    } else {
      setLoading(false);
      setReports([]);
    }
  }, [companyId]);

  return {
    reports,
    loading,
    error,
    deleteReport,
    renameReport,
    refetch: fetchReports,
  };
};

export const useComplianceReport = (id: string, companyId: string) => {
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const generatedReportId = parseInt(id, 10);
      if (isNaN(generatedReportId)) {
        throw new Error('Invalid report ID');
      }
      const data = await fetchComplianceReport(generatedReportId, companyId);
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  const downloadExecutiveSummary = async () => {
    try {
      if (!report?.generated_report_id) {
        console.error('No generated_report_id available for download');
        return;
      }
      const downloadUrl = await downloadExecutiveSummaryReport(report.generated_report_id);
      window.open(downloadUrl, '_blank');
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const downloadSOP = async (format: 'pdf' | 'docx') => {
    try {
      if (!report?.generated_report_id) {
        console.error('No generated_report_id available for download');
        return;
      }
      
      const downloadUrl = await downloadSOPReport(report.generated_report_id, format);
      window.open(downloadUrl, '_blank');
      
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  useEffect(() => {
    if (id && companyId) {
      fetchReport();
    } else {
      setLoading(false);
      setReport(null);
    }
  }, [id, companyId]);

  return {
    report,
    loading,
    error,
    refetch: fetchReport,
    downloadExecutiveSummary,
    downloadSOP,
  };
};

// Хук только для создания отчетов
export const useCreateComplianceReport = (companyId: string) => {
  const [error, setError] = useState<string | null>(null);

  const createReportWithExistingGuidelines = async (
    guidelinesId: string, 
    sopFiles: File[],
    guidelinesFiles?: File[],
    sopIds?: string[],
    guidelinesType?: string,
    createdBy?: string
  ) => {
    if (!companyId) {
      const errorMessage = 'Workspace ID is not available';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
    try {
      setError(null);
      const newReport = await createComplianceReportWithExistingGuidelines(
        companyId,
        guidelinesId, 
        sopFiles, 
        guidelinesFiles, 
        sopIds,
        guidelinesType,
        createdBy
      );
      return newReport;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create report with existing guidelines';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    error,
    createReportWithExistingGuidelines,
  };
}; 
