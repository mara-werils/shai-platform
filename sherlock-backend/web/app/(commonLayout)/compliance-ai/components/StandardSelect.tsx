'use client'

import React, { useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RiSearchLine, RiCloseLine } from '@remixicon/react';
import { FileTypeIcon } from '@/app/components/base/file-uploader';
import { extensionToFileType } from '@/app/components/datasets/hit-testing/utils/extension-to-file-type';
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '@/app/components/base/portal-to-follow-elem';

interface Standard {
  id: number;
  unique_id: string;
  fileName: string;
}

interface StandardSelectProps {
  standards: Standard[];
  selectedStandard: number | null;
  onSelect: (standardId: number) => void;
  placeholder?: string;
  className?: string;
}

const StandardSelect: React.FC<StandardSelectProps> = ({
  standards,
  selectedStandard,
  onSelect,
  placeholder,
  className = ""
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const triggerRef = useRef<HTMLDivElement>(null);

  const displayPlaceholder = placeholder || t('complianceAi.standardSelect.placeholder');

  const selectedItem = standards.find(s => s.id === selectedStandard);
  
  const filteredStandards = useMemo(() => {
    if (!searchQuery) {
      return standards;
    }
    return standards.filter(standard => 
      standard.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [standards, searchQuery]);

  const handleSelect = (id: number) => {
    onSelect(id);
    setOpen(false);
    setSearchQuery('');
  };

  return (
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
          {selectedItem ? (
            <div className="flex items-center gap-2">
              <FileTypeIcon 
                type={extensionToFileType(selectedItem.fileName.split('.').pop() || '')} 
                size="sm"
              />
              <span className="truncate flex-1">{selectedItem.fileName}</span>
            </div>
          ) : (
            <span className="text-gray-500">{displayPlaceholder}</span>
          )}
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
                placeholder={t('complianceAi.standardSelect.searchPlaceholder')}
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

          {/* Standards List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredStandards.length > 0 ? (
              filteredStandards.map((standard) => (
                <div
                  key={standard.id}
                  className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                    selectedStandard === standard.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleSelect(standard.id)}
                >
                  <FileTypeIcon 
                    type={extensionToFileType(standard.fileName.split('.').pop() || '')} 
                    size="sm"
                  />
                  <span className="flex-1 truncate text-sm max-w-[350px]">
                    {standard.fileName}
                  </span>
                  {selectedStandard === standard.id && (
                    <svg className="w-4 h-4 text-blue-600 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-sm text-gray-500">
                {searchQuery ? t('complianceAi.standardSelect.noStandardsFound') : t('complianceAi.standardSelect.noStandardsAvailable')}
              </div>
            )}
          </div>
        </div>
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  );
};

export default StandardSelect; 