import { COMPLIANCE_API_BASE_URL } from './compliance-standards';
import { shaiFetch, shaiFetchFormData } from './shai-fetch';

export interface ComplianceSOP {
  id: number;
  unique_id: string;
  fileName: string;
  uploadedDate: string;
  version_number: string;
  created_by?: string;
}

export const fetchComplianceSOPs = async (companyId: string): Promise<ComplianceSOP[]> => {
  const url = new URL(`${COMPLIANCE_API_BASE_URL}/sops/`);
  url.searchParams.append('company_id', companyId);
  
  const res = await shaiFetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch SOPs');
  const result = await res.json();
  const data = Array.isArray(result) ? result : [];

  return data.map((item: any) => ({
    id: item.id,
    unique_id: item.unique_id,
    fileName: item.title,
    uploadedDate: item.uploaded_at,
    version_number: item.version_number || '',
    created_by: item.created_by,
  }));
};

export const deleteComplianceSOP = async (uniqueId: string): Promise<boolean> => {
  const res = await shaiFetch(`${COMPLIANCE_API_BASE_URL}/sops/delete/${uniqueId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete SOP');
  return true;
};

export const downloadComplianceSOP = async (uniqueId: string): Promise<string> => {
  const res = await shaiFetch(`${COMPLIANCE_API_BASE_URL}/sops/download/${uniqueId}`, {
    method: 'GET',
  });
  if (!res.ok) throw new Error('Failed to download SOP');
  const result = await res.json();
  return result.download_url || result.url || result.link;
};

export const uploadComplianceSOP = async (files: File[], companyId: string, userName?: string): Promise<boolean> => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  formData.append('company_id', companyId);
  if (userName) {
    formData.append('created_by', userName);
  }
  
  const res = await shaiFetchFormData(`${COMPLIANCE_API_BASE_URL}/sops/upload`, formData);
  if (!res.ok) throw new Error('Failed to upload SOPs');
  return true;
}; 
