import { COMPLIANCE_API_BASE_URL } from './compliance-standards';
import { shaiFetch, shaiFetchFormData } from './shai-fetch';

export interface ComplianceReport {
  generated_report_id: number;
  invocation_id: string;
  dag_run_id: string;
  guidelines_type: string;
  report_name?: string;
  created_at: string;
  processing_status: string;
  created_by?: string;
  json_content?: ReportJsonContent;
}

export interface ReportJsonContent {
  ExecutiveSummary: {
    Overview: string;
    CriticalGaps?: ApiCriticalGap[];
  };
  recommended_actions: string[];
  RegulationCoverageGaps: ApiRegulationCoverageGap[];
  sop_specific_gaps: ApiSopSpecificGap[];
  kpimetrics?: {
    clauses: number;
    coverage_percentage: number;
    gaps: number;
    sops: number;
    sops_which_needs_corrective_actions: number;
  };
}

export interface ApiCriticalGap {
  GapDescription: string;
  RecommendedActions: string[];
}



export interface ApiRegulationCoverageGap {
  CoverageStatus: string;
  GapDescription: string;
  Impact: string;
  RegulationSection: string;
}

export interface ApiSopSpecificGap {
  gap_description: string;
  regulation_section: string;
  severity: string;
  sop_name: string;
  sop_id: string;
  markdown_content: string;
  assigned_to?: string | number;
}

export const fetchComplianceReports = async (companyId: string): Promise<ComplianceReport[]> => {
  const url = new URL(`${COMPLIANCE_API_BASE_URL}/generated-guideline-reports`);
  url.searchParams.append('company_id', companyId);
  
  const res = await shaiFetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch reports');
  const result = await res.json();
  const data = Array.isArray(result.data) ? result.data : [];

  return data;
};

export const deleteComplianceReport = async (generatedReportId: number): Promise<boolean> => {
  const res = await shaiFetch(`${COMPLIANCE_API_BASE_URL}/delete/report/id/${generatedReportId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete report');
  return true;
};

export const renameComplianceReport = async (generatedReportId: number, report_name: string, companyId: string): Promise<boolean> => {
  const url = new URL(`${COMPLIANCE_API_BASE_URL}/reports/id/${generatedReportId}`);
  url.searchParams.append('company_id', companyId);
  
  const res = await shaiFetch(url.toString(), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ report_name }),
  });
  if (!res.ok) throw new Error('Failed to rename report');
  return true;
};





export const createComplianceReportWithExistingGuidelines = async (
  companyId: string,
  guidelinesId: string, 
  sopFiles: File[],
  guidelinesFiles?: File[],
  sopIds?: string[],
  guidelinesType?: string,
  createdBy?: string
): Promise<ComplianceReport> => {
  const formData = new FormData();
  
  // Add company_id
  formData.append('company_id', companyId);
  
  // Add guidelines ID if provided
  if (guidelinesId) {
    formData.append('guideline_id', guidelinesId);
  }
  
  // Add guidelines files if provided
  if (guidelinesFiles && guidelinesFiles.length > 0) {
    guidelinesFiles.forEach((file) => {
      formData.append('guidelines_file', file);
    });
  }
  
  // Add SOP IDs if provided
  if (sopIds && sopIds.length > 0) {
    sopIds.forEach((sopId) => {
      formData.append('sop_ids', sopId);
    });
  }
  
  // Add SOP files if provided
  if (sopFiles && sopFiles.length > 0) {
    sopFiles.forEach((file) => {
      formData.append('sop_files', file);
    });
  }
  
  // Add guidelines_type if provided
  if (guidelinesType) {
    formData.append('guidelines_type', guidelinesType);
  }
  
  // Add created_by if provided
  if (createdBy) {
    formData.append('created_by', createdBy);
  }

  const res = await shaiFetchFormData(`${COMPLIANCE_API_BASE_URL}/guidelines-report-generation-unified`, formData);
  
  if (!res.ok) throw new Error('Failed to create report with existing guidelines');
  const result = await res.json();
  return result;
};



export const fetchComplianceReport = async (generatedReportId: number, companyId: string): Promise<ComplianceReport | null> => {
  try {
    const url = new URL(`${COMPLIANCE_API_BASE_URL}/generated-guideline-reports`);
    url.searchParams.append('generated_report_id', generatedReportId.toString());
    url.searchParams.append('company_id', companyId);
    
    const res = await shaiFetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch report');
    const result = await res.json();

    const data = Array.isArray(result.data) ? result.data[0] : result.data;
    
    if (!data) {
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching report:', error);
    return null;
  }
};

export const downloadExecutiveSummaryReport = async (generatedReportId: number): Promise<string> => {
  const res = await shaiFetch(`${COMPLIANCE_API_BASE_URL}/download/exsum/id/${generatedReportId}`);
  if (!res.ok) throw new Error('Failed to download executive summary report');
  const result = await res.json();
  return result.download_url || result.url || result;
};

export const downloadSOPReport = async (generatedReportId: number, format: string = 'pdf'): Promise<string> => {
  const res = await shaiFetch(`${COMPLIANCE_API_BASE_URL}/download/sop-report/id/${generatedReportId}?format=${format}`);
  if (!res.ok) throw new Error('Failed to download SOP report');
  const result = await res.json();
  return result.download_url || result.url || result;
};

export const reanalyzeSOPGap = async (files: File[], originalGapId: string, generatedReportId: number, userName?: string): Promise<any> => {
  const formData = new FormData();
  
  files.forEach(file => {
    formData.append('file', file);
  });
  formData.append('original_gap_id', originalGapId);
  formData.append('generated_report_id', generatedReportId.toString());
  formData.append('created_by', userName || 'User');
  
  const res = await shaiFetchFormData(`${COMPLIANCE_API_BASE_URL}/reanalyze/sop-gap`, formData);
  
  if (!res.ok) throw new Error('Failed to re-analyze SOP gap');
  const result = await res.json();
  return result;
};

export interface GapAnalysisComparisonItem {
  old_sop_name: string;
  new_sop_name: string;
  gap_description: string;
  old_severity: string;
  new_severity: string;
  severity_change: string;
  original_gap_id?: number;
  created_by?: string;
}

export const fetchGapAnalysisComparison = async (generatedReportId: number): Promise<GapAnalysisComparisonItem[]> => {
  const res = await shaiFetch(`${COMPLIANCE_API_BASE_URL}/reanalyze/history/by-report/${generatedReportId}`);
  
  if (!res.ok) throw new Error('Failed to fetch gap analysis comparison');
  const result = await res.json();
  return Array.isArray(result) ? result : [];
}; 

export const assignSopGap = async (userId: string | number, sopSpecificGapId: string | number): Promise<void> => {
  const res = await shaiFetch(`${COMPLIANCE_API_BASE_URL}/assign/gap`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      sop_specific_gap_id: sopSpecificGapId,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || 'Failed to assign gap');
  }
}