'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { 
  RiMoreFill, 
  RiEyeLine, 
  RiDeleteBinLine,
  RiFileChartLine,
  RiEditLine
} from '@remixicon/react';
import { useComplianceReports } from '@/hooks/shai/use-compliance-reports';
import { useAppContext } from '@/context/app-context';
import Button from '@/app/components/base/button';
import Loading from '@/app/components/base/loading';
import StatusBadge from '@/app/components/base/status-badge';
import Pagination from '@/app/components/base/pagination';
import { formatDate } from '../utils/date-utils';
import RenameModal from './components/RenameModal';

const AnalysisTable = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { currentWorkspace, isLoadingCurrentWorkspace } = useAppContext();
  const { 
    reports, 
    loading, 
    deleteReport,
    renameReport
  } = useComplianceReports(currentWorkspace.id);
  
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<{ id: number; name: string } | null>(null);

  const paginatedReports = reports.slice(page * limit, (page + 1) * limit);



  const handleMenuToggle = (id: string, event: React.MouseEvent) => {
    if (openMenuId === id) {
      setOpenMenuId(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setMenuPosition({ x: rect.right - 192, y: rect.bottom + 8 });
      setOpenMenuId(id);
    }
  };

  const handleViewClick = (id: number) => {
    router.push(`/compliance-ai/analysis/${id}`);
    setOpenMenuId(null);
  };

  const handleDeleteClick = async (generatedReportId: number) => {
    try {
      await deleteReport(generatedReportId);
      setOpenMenuId(null);
    } catch (error) {
      console.error('Failed to delete report:', error);
    }
  };

  const handleRenameClick = (id: number, name: string) => {
    setSelectedReport({ id, name });
    setRenameModalOpen(true);
    setOpenMenuId(null);
  };

  const handleRename = async (newName: string) => {
    if (selectedReport) {
      await renameReport(selectedReport.id, newName);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !(event.target as Element).closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  if (isLoadingCurrentWorkspace || loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loading type="area" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[20px] border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto overflow-y-visible">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('complianceAi.analysisTable.reportName')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('complianceAi.analysisTable.createdDate')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('complianceAi.analysisTable.createdBy')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('complianceAi.analysisTable.status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('complianceAi.sopsTable.version')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('complianceAi.analysisTable.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedReports.map((report) => (
              <tr 
                key={report.generated_report_id} 
                className={`hover:bg-gray-50 ${report.processing_status !== 'failed' ? 'cursor-pointer' : ''}`}
                onClick={() => {
                  if (report.processing_status !== 'failed') {
                    handleViewClick(report.generated_report_id);
                  }
                }}
              >
                                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="max-w-[460px]">
                     <div className="text-sm font-medium text-gray-900 truncate">
                       {report.report_name || report.guidelines_type}
                     </div>
                   </div>
                 </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(report.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {report.created_by || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={report.processing_status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {report.version ?? '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium overflow-visible" onClick={(e) => e.stopPropagation()}>
                  <div className="relative">
                    <Button
                      type="button"
                      variant="ghost"
                      className="p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuToggle(report.generated_report_id.toString(), e);
                      }}
                    >
                      <RiMoreFill className="h-4 w-4" />
                    </Button>
                    
                    {openMenuId === report.generated_report_id.toString() && (
                      <div 
                        className="fixed w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 menu-container"
                        style={{ 
                          left: `${menuPosition.x}px`, 
                          top: `${menuPosition.y}px` 
                        }}
                      >
                        <div className="py-1">
                          {report.processing_status !== 'failed' && (
                            <>
                              <button
                                onClick={() => handleViewClick(report.generated_report_id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <RiEyeLine className="h-4 w-4 mr-2" />
                                {t('complianceAi.analysisTable.view')}
                              </button>
                              <button
                                onClick={() => handleRenameClick(report.generated_report_id, report.report_name || report.guidelines_type)}
                                disabled={!report.generated_report_id}
                                className={`flex items-center w-full px-4 py-2 text-sm ${
                                  report.generated_report_id 
                                    ? 'text-gray-700 hover:bg-gray-100' 
                                    : 'text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                <RiEditLine className="h-4 w-4 mr-2" />
                                {t('complianceAi.analysisTable.rename')}
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteClick(report.generated_report_id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <RiDeleteBinLine className="h-4 w-4 mr-2" />
                            {t('complianceAi.analysisTable.delete')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {reports.length === 0 && (
        <div className="text-center py-8">
          <RiFileChartLine className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{t('complianceAi.analysisPage.noReportsFound')}</p>
        </div>
      )}
      {reports.length > 0 && (
        <Pagination
          current={page}
          onChange={setPage}
          total={reports.length}
          limit={limit}
          onLimitChange={(l) => { setLimit(l); setPage(0); }}
        />
      )}

      {/* Rename Modal */}
      <RenameModal
        open={renameModalOpen}
        onClose={() => setRenameModalOpen(false)}
        currentName={selectedReport?.name || ''}
        onRename={handleRename}
      />
    </div>
  );
};

export default AnalysisTable; 
