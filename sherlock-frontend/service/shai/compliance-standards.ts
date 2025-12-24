import { shaiFetch, shaiFetchFormData } from './shai-fetch';

export interface ComplianceStandard {
  id: number;
  unique_id: string;
  fileName: string;
  uploadedDate: string;
  created_by?: string;
}

export const COMPLIANCE_API_BASE_URL = 'https://aws-compliance-ai.shai.pro';

export const fetchComplianceStandards = async (companyId: string): Promise<ComplianceStandard[]> => {
  const url = new URL(`${COMPLIANCE_API_BASE_URL}/guidelines/`);
  url.searchParams.append('company_id', companyId);
  
  const res = await shaiFetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch standards');
  const result = await res.json();
  const data = Array.isArray(result) ? result : [];

  return data.map((item: any) => ({
    id: item.id,
    unique_id: item.unique_id,
    fileName: item.name,
    uploadedDate: item.uploaded_at,
    created_by: item.created_by,
  }));
};

export const deleteComplianceStandard = async (uniqueId: string): Promise<boolean> => {
  const res = await shaiFetch(`${COMPLIANCE_API_BASE_URL}/guidelines/delete/${uniqueId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete standard');
  return true;
};

export const uploadComplianceStandard = async (files: File[], companyId: string, userName?: string): Promise<boolean> => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  formData.append('company_id', companyId);
  if (userName) {
    formData.append('created_by', userName);
  }
  
  const res = await shaiFetchFormData(`${COMPLIANCE_API_BASE_URL}/guidelines/upload`, formData);
  if (!res.ok) throw new Error('Failed to upload standards');
  return true;
};

export const downloadComplianceStandard = async (uniqueId: string): Promise<string> => {
  const res = await shaiFetch(`${COMPLIANCE_API_BASE_URL}/guidelines/download/${uniqueId}`, {
    method: 'GET',
  });
  if (!res.ok) throw new Error('Failed to download standard');
  const result = await res.json();
  return result.download_url || result.url || result.link;
}; 
