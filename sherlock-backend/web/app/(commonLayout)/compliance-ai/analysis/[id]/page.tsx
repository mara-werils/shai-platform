'use client'

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useComplianceReport } from '@/hooks/shai/use-compliance-reports';
import { useAppContext } from '@/context/app-context';
import ReportView from '../../components/ReportView';
import Loading from '@/app/components/base/loading';
import styles from '../../styles.module.css';
import { RiArrowLeftLine } from '@remixicon/react';
import Button from '@/app/components/base/button';
import { RiDownloadLine } from '@remixicon/react';
import { formatDate } from '../../utils/date-utils';

const ReportPage = () => {
  const params = useParams();
  const { t } = useTranslation();
  const { currentWorkspace, isLoadingCurrentWorkspace } = useAppContext();
  const reportId = params.id as string;
  const { report, loading, downloadExecutiveSummary, downloadSOP } = useComplianceReport(reportId, currentWorkspace.id);

  if (isLoadingCurrentWorkspace || loading) {
    return (
      <div className='scroll-container relative flex grow flex-col overflow-y-auto bg-white'>
        <div className={`${styles.navigationHeader} flex flex-wrap items-center gap-y-2 bg-white !bg-white`}>
          <div className="flex items-center gap-4">
            <button type="button" className="p-2" onClick={() => history.back()}>
              <RiArrowLeftLine className="h-4 w-4" />
            </button>
            <h1 className={`${styles.pageTitle}`}>{t('complianceAi.reportPage.loading')}</h1>
          </div>
        </div>
        <div className={styles.contentSection}>
          <Loading type="app" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className='scroll-container relative flex grow flex-col overflow-y-auto bg-white'>
        <div className={`${styles.navigationHeader} flex flex-wrap items-center gap-y-2 bg-white !bg-white`}>
          <div className="flex items-center gap-4">
            <button type="button" className="p-2" onClick={() => history.back()}>
              <RiArrowLeftLine className="h-4 w-4" />
            </button>
            <h1 className={`${styles.pageTitle}`}>{t('complianceAi.reportPage.reportNotFound')}</h1>
          </div>
        </div>
        <div className={styles.contentSection}>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center py-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">{t('complianceAi.reportPage.reportNotFound')}</h1>
              <p className="text-gray-500">{t('complianceAi.reportPage.reportNotFoundDescription')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className='scroll-container relative flex grow flex-col overflow-y-auto bg-white'>
      <div className={`${styles.navigationHeader} flex flex-wrap items-center justify-between gap-y-2 bg-white !bg-white`}>
        <div className="flex items-center gap-4">
          <button type="button" className="p-2" onClick={() => history.back()}>
            <RiArrowLeftLine className="h-4 w-4" />
          </button>
          <div className="flex flex-col">
            <h1 className={`${styles.pageTitle}`}>{report?.report_name || report?.guidelines_type || t('complianceAi.reportPage.reportFallback')}</h1>
            <span className="text-gray-500">
              {t('complianceAi.reportPage.assessmentDate')} {formatDate(report.created_at)}
            </span>
          </div>
        </div>
        {report.processing_status === 'completed' && (
          <div className="flex items-center">
            <Button 
              type="button" 
              variant="primary"
              onClick={downloadExecutiveSummary}
            >
              <RiDownloadLine className="mr-2 h-4 w-4" />
              {t('complianceAi.reportPage.exportSummary')}
            </Button>
          </div>
        )}
      </div>
      <div className={styles.contentSection}>
        <ReportView report={report} onDownloadSOP={downloadSOP} />
      </div>
    </div>
  );
};

export default ReportPage; 
