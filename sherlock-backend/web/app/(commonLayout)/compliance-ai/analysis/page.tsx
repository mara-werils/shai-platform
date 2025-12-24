'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Button from '@/app/components/base/button';
import TabSliderNew from '@/app/components/base/tab-slider-new';
import AnalysisTable from './AnalysisTable';
import styles from '../styles.module.css';
import { 
  RiDatabase2Line, 
  RiFileChartLine, 
  RiAddLine,
  RiFilter3Line
} from '@remixicon/react';

const ComplianceAIAnalysisPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [filterOpen, setFilterOpen] = useState(false);

  const mainOptions = [
    { value: 'analysis', text: t('complianceAi.navigation.analysis'), icon: <RiFileChartLine className='mr-2 h-4 w-4' /> },
    { value: 'storage', text: t('complianceAi.navigation.storage'), icon: <RiDatabase2Line className='mr-2 h-4 w-4' /> },
  ];

  const handleMainTabChange = (value: string) => {
    if (value === 'storage') {
      router.push('/compliance-ai');
    }
  };

  return (
    <div className='scroll-container relative flex grow flex-col overflow-y-auto bg-background-body'>

      <div className={`${styles.navigationHeader} flex flex-wrap items-center justify-between gap-y-2`}>
        <TabSliderNew
          value="analysis"
          onChange={handleMainTabChange}
          options={mainOptions}
        />
      </div>

      <div className={`${styles.contentHeader} flex flex-wrap items-center justify-between gap-y-2`}>
        <div className="w-4/5">
          <h1 className={`${styles.pageTitle}`}>{t('complianceAi.analysisPage.title')}</h1>
          <p className={`${styles.pageDescription}`}>
            {t('complianceAi.analysisPage.description')}
          </p>
        </div>
        <div className="w-1/5 flex items-center justify-end gap-2">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => setFilterOpen(true)}
            styleCss={{ display: 'none' }}
          >
            <RiFilter3Line className='mr-2 h-4 w-4' />
            {t('complianceAi.analysisPage.filter')}
          </Button>
          <Button 
            type="button" 
            variant="primary" 
            onClick={() => router.push('/compliance-ai/analysis/new')}
          >
            <RiAddLine className='mr-2 h-4 w-4' />
            {t('complianceAi.analysisPage.newAnalysis')}
          </Button>
        </div>
      </div>

      <div className={styles.contentSection}>
        <AnalysisTable />
      </div>
    </div>
  );
};

export default ComplianceAIAnalysisPage; 
