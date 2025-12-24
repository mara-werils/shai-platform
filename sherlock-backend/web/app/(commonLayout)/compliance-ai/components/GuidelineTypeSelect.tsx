'use client'

import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '@/app/components/base/portal-to-follow-elem';

interface GuidelineTypeOption {
  value: string;
  label: string;
}

interface GuidelineTypeSelectProps {
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const GUIDELINE_TYPES: GuidelineTypeOption[] = [
  { value: 'Quality System Regulation (QSR)', label: 'Quality System Regulation (QSR)' },
  { value: 'EU Medical Device Regulation (MDR)', label: 'EU Medical Device Regulation (MDR)' },
  { value: 'In Vitro Diagnostic Regulation (IVDR)', label: 'In Vitro Diagnostic Regulation (IVDR)' },
  { value: 'Good Manufacturing Practice (GMP)', label: 'Good Manufacturing Practice (GMP)' },
  { value: 'Good Laboratory Practice (GLP)', label: 'Good Laboratory Practice (GLP)' },
  { value: 'ISO 9001 Quality Management System(ISO)', label: 'ISO 9001 Quality Management System(ISO)' },
];

const GuidelineTypeSelect: React.FC<GuidelineTypeSelectProps> = ({
  selectedValue,
  onSelect,
  placeholder,
  className = ""
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  
  const displayPlaceholder = placeholder || t('complianceAi.guidelineTypeSelect.placeholder');

  const selectedItem = GUIDELINE_TYPES.find(type => type.value === selectedValue);

  const handleSelect = (value: string) => {
    onSelect(value);
    setOpen(false);
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
            <span className="truncate flex-1">{selectedItem.label}</span>
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
          {/* Types List */}
          <div className="max-h-60 overflow-y-auto">
            {GUIDELINE_TYPES.map((type) => (
              <div
                key={type.value}
                className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                  selectedValue === type.value ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleSelect(type.value)}
              >
                <span className="flex-1 truncate text-sm max-w-[350px]">
                  {type.label}
                </span>
                {selectedValue === type.value && (
                  <svg className="w-4 h-4 text-blue-600 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  );
};

export default GuidelineTypeSelect;

