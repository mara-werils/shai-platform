'use client'

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  RiMoreFill, 
  RiDownloadLine, 
  RiDeleteBinLine
} from '@remixicon/react';
import { useComplianceSOPs } from '@/hooks/shai/use-compliance-sops';
import { useAppContext } from '@/context/app-context';
import Button from '@/app/components/base/button';
import { FileTypeIcon } from '@/app/components/base/file-uploader';
import { extensionToFileType } from '@/app/components/datasets/hit-testing/utils/extension-to-file-type';
import Loading from '@/app/components/base/loading';
import Pagination from '@/app/components/base/pagination';
import { formatDate } from './utils/date-utils';
import { subscribeToEvent, EVENTS } from './utils/event-emitter';

const SOPsTable = () => {
  const { t } = useTranslation();
  const { currentWorkspace, isLoadingCurrentWorkspace } = useAppContext();
  const { 
    sops, 
    loading, 
    deleteSOP,
    downloadSOP,
    refetch
  } = useComplianceSOPs(currentWorkspace.id);
  
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const paginatedSOPs = sops.slice(page * limit, (page + 1) * limit);





  const handleMenuToggle = (id: string, event: React.MouseEvent) => {
    if (openMenuId === id) {
      setOpenMenuId(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setMenuPosition({ x: rect.right - 192, y: rect.bottom + 8 });
      setOpenMenuId(id);
    }
  };

  const handleDownloadClick = async (id: string) => {
    try {
      await downloadSOP(id);
      setOpenMenuId(null);
    } catch (error) {
      console.error('Failed to download SOP:', error);
    }
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await deleteSOP(id);
      setOpenMenuId(null);
    } catch (error) {
      console.error('Failed to delete SOP:', error);
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

  useEffect(() => {
    const unsubscribe = subscribeToEvent(EVENTS.SOPS_UPDATED, () => {
      refetch();
    });

    return unsubscribe;
  }, [refetch]);

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
                {t('complianceAi.sopsTable.reportName')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('complianceAi.sopsTable.uploadedDate')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('complianceAi.sopsTable.createdBy')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('complianceAi.sopsTable.version')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('complianceAi.sopsTable.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedSOPs.map((sop) => (
              <tr key={sop.unique_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                                         <FileTypeIcon 
                       type={extensionToFileType(sop.fileName.split('.').pop() || '')} 
                       className="mr-3" 
                       size="md"
                     />
                     <div className="max-w-[460px]">
                       <div className="text-sm font-medium text-gray-900 truncate">
                         {sop.fileName}
                       </div>
                     </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(sop.uploadedDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sop.created_by || '-'}
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                   {sop.version_number}
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium overflow-visible">
                  <div className="relative">
                    <Button
                      type="button"
                      variant="ghost"
                      className="p-1"
                      onClick={(e) => handleMenuToggle(sop.unique_id, e)}
                    >
                      <RiMoreFill className="h-4 w-4" />
                    </Button>
                    
                    {openMenuId === sop.unique_id && (
                      <div 
                        className="fixed w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 menu-container"
                        style={{ 
                          left: `${menuPosition.x}px`, 
                          top: `${menuPosition.y}px` 
                        }}
                      >
                        <div className="py-1">
                          <button
                            onClick={() => handleDownloadClick(sop.unique_id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <RiDownloadLine className="h-4 w-4 mr-2" />
                            {t('complianceAi.sopsTable.download')}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(sop.unique_id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <RiDeleteBinLine className="h-4 w-4 mr-2" />
                            {t('complianceAi.sopsTable.delete')}
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
      
      {sops.length === 0 && (
        <div className="text-center py-8">
          <FileTypeIcon 
            type="document" 
            className="h-12 w-12 text-gray-300 mx-auto mb-4" 
            size="lg"
          />
          <p className="text-gray-500">{t('complianceAi.sopsTable.noSOPsFound')}</p>
        </div>
      )}
      {sops.length > 0 && (
        <Pagination
          current={page}
          onChange={setPage}
          total={sops.length}
          limit={limit}
          onLimitChange={(l) => { setLimit(l); setPage(0); }}
        />
      )}
    </div>
  );
};

export default SOPsTable; 
