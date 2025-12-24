'use client'

import React, { useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { RiSearchLine, RiCloseLine } from '@remixicon/react';
import { FileTypeIcon } from '@/app/components/base/file-uploader';
import { extensionToFileType } from '@/app/components/datasets/hit-testing/utils/extension-to-file-type';
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '@/app/components/base/portal-to-follow-elem';

interface SOP {
  id: number;
  unique_id: string;
  fileName: string;
  version_number: string;
  created_by?: string;
}

interface SOPSelectProps {
  sops: SOP[];
  selectedSOPs: number[];
  onSelect: (sopIds: number[]) => void;
  placeholder?: string;
  className?: string;
}

const SOPSelect: React.FC<SOPSelectProps> = ({
  sops,
  selectedSOPs,
  onSelect,
  placeholder,
  className = ""
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const triggerRef = useRef<HTMLDivElement>(null);

  const displayPlaceholder = placeholder || t('complianceAi.sopSelect.placeholder');

  const selectedItems = sops.filter(s => selectedSOPs.includes(s.id));
  
  const filteredSOPs = useMemo(() => {
    if (!searchQuery) {
      return sops;
    }
    return sops.filter(sop => 
      sop.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sops, searchQuery]);

  const handleSelect = (id: number) => {
    const newSelectedSOPs = selectedSOPs.includes(id)
      ? selectedSOPs.filter(sopId => sopId !== id)
      : [...selectedSOPs, id];
    
    onSelect(newSelectedSOPs);
  };

  const handleRemoveSelected = (id: number) => {
    const newSelectedSOPs = selectedSOPs.filter(sopId => sopId !== id);
    onSelect(newSelectedSOPs);
  };

  const handleSelectAll = () => {
    const allFilteredIds = filteredSOPs.map(sop => sop.id);
    const allSelected = allFilteredIds.every(id => selectedSOPs.includes(id));
    
    if (allSelected) {
      const newSelectedSOPs = selectedSOPs.filter(id => !allFilteredIds.includes(id));
      onSelect(newSelectedSOPs);
    } else {
      const newSelectedSOPs = [...new Set([...selectedSOPs, ...allFilteredIds])];
      onSelect(newSelectedSOPs);
    }
  };

  const allFilteredSelected = filteredSOPs.length > 0 && filteredSOPs.every(sop => selectedSOPs.includes(sop.id));

  return (
    <div className="space-y-3">
      {/* Selected SOPs Display */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedItems.map((sop) => (
            <div
              key={sop.id}
              className="flex items-center gap-2 px-3 py-1 bg-[#F9FAFB] border border-transparent rounded-lg text-sm"
            >
              <FileTypeIcon 
                type={extensionToFileType(sop.fileName.split('.').pop() || '')} 
                size="sm"
              />
              <span className="truncate max-w-[200px]">{sop.fileName}</span>
              <button
                onClick={() => handleRemoveSelected(sop.id)}
                className="text-[#495464] hover:text-[#495464]/80"
              >
                <RiCloseLine className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* SOP Selector */}
      <PortalToFollowElem
        open={open}
        onOpenChange={setOpen}
        placement='bottom-start'
        offset={4}
      >
        <PortalToFollowElemTrigger 
          onClick={() => setOpen(v => !v)} 
          className='w-full'
        >
          <div 
            ref={triggerRef}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-base cursor-pointer hover:bg-gray-50 ${className}`}
          >
            <span className="text-gray-500">{displayPlaceholder}</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </PortalToFollowElemTrigger>
        
        <PortalToFollowElemContent className="z-20">
          <div 
            className="rounded-lg border border-gray-200 bg-white shadow-lg"
            style={{ 
              width: triggerRef.current?.offsetWidth || 'auto',
              minWidth: '200px'
            }}
          >
            {/* Search Input */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('complianceAi.sopSelect.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <RiCloseLine className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* SOPs List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredSOPs.length > 0 ? (
                <>
                  {/* Table Header */}
                  <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div 
                      className="flex items-center justify-center w-4 h-4 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectAll();
                      }}
                    >
                      {allFilteredSelected ? (
                        <div className="w-4 h-4 border-2 border-blue-600 rounded bg-blue-600 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-4 h-4 border border-gray-300 rounded"></div>
                      )}
                    </div>
                    <div className="flex-1">{t('complianceAi.sopSelect.name')}</div>
                    <div className="w-40">{t('complianceAi.sopSelect.createdBy')}</div>
                    <div className="w-20">{t('complianceAi.sopSelect.version')}</div>
                  </div>
                  
                  {/* Table Rows */}
                  {filteredSOPs.map((sop) => (
                    <div
                      key={sop.id}
                      className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                        selectedSOPs.includes(sop.id) ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleSelect(sop.id)}
                    >
                      <div className="flex items-center justify-center w-4 h-4">
                        {selectedSOPs.includes(sop.id) ? (
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <div className="w-4 h-4 border border-gray-300 rounded"></div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileTypeIcon 
                          type={extensionToFileType(sop.fileName.split('.').pop() || '')} 
                          size="sm"
                        />
                        <span className="truncate text-sm">
                          {sop.fileName}
                        </span>
                      </div>
                      <div className="w-40 text-sm text-gray-600 truncate min-w-0">
                        {sop.created_by || '-'}
                      </div>
                      <div className="w-20 text-sm text-gray-600">
                        {sop.version_number}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="px-3 py-4 text-center text-sm text-gray-500">
                  {searchQuery ? t('complianceAi.sopSelect.noSOPsFound') : t('complianceAi.sopSelect.noSOPsAvailable')}
                </div>
              )}
            </div>
          </div>
        </PortalToFollowElemContent>
      </PortalToFollowElem>
    </div>
  );
};

export default SOPSelect;
