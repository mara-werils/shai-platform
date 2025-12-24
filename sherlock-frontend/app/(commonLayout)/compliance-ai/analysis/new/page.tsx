'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Button from '@/app/components/base/button';
import { useComplianceStandards } from '@/hooks/shai/use-compliance-standards';
import { useComplianceSOPs } from '@/hooks/shai/use-compliance-sops';
import { useCreateComplianceReport } from '@/hooks/shai/use-compliance-reports';
import { useAppContext } from '@/context/app-context';
import styles from '../../styles.module.css';
import FileUploader from '../../components/FileUploader';
import StandardSelect from '../../components/StandardSelect';
import GuidelineTypeSelect from '../../components/GuidelineTypeSelect';
import SOPSelect from '../../components/SOPSelect';
import ReportView from '../../components/ReportView';
import Toast from '@/app/components/base/toast';
import Loading from '@/app/components/base/loading';
import { formatDate } from '../../utils/date-utils';
import { TopBar } from './components/TopBar';

const NewAnalysisPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { currentWorkspace, userProfile, isLoadingCurrentWorkspace } = useAppContext();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  
  // Regulatory Standard state
  const [selectedStandard, setSelectedStandard] = useState<number | null>(null);
  const [selectedStandardFile, setSelectedStandardFile] = useState<File[]>([]);
  const [selectedGuidelineType, setSelectedGuidelineType] = useState<string>('');
  
  // SOPs state
  const [selectedSOPs, setSelectedSOPs] = useState<number[]>([]);
  const [selectedSOPFiles, setSelectedSOPFiles] = useState<File[]>([]);
  
  // Analysis state
  const [isCreating, setIsCreating] = useState(false);
  const [createdReport, setCreatedReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { standards, loading: standardsLoading } = useComplianceStandards(currentWorkspace.id);
  const { sops, loading: sopsLoading } = useComplianceSOPs(currentWorkspace.id);
  const { createReportWithExistingGuidelines } = useCreateComplianceReport(currentWorkspace.id);

  const handleStandardSelect = (standardId: number) => {
    setSelectedStandard(standardId);
    // Clear uploaded file when selecting from list
    setSelectedStandardFile([]);
  };

  const handleStandardFilesChange = (files: File[]) => {
    // Limit to one file for standards
    const limitedFiles = files.slice(0, 1);
    setSelectedStandardFile(limitedFiles);
    // Clear selected standard when uploading file
    if (limitedFiles.length > 0) {
      setSelectedStandard(null);
    }
  };

  const handleSOPSelect = (sopIds: number[]) => {
    setSelectedSOPs(sopIds);
  };

  const handleSOPFilesChange = (files: File[]) => {
    setSelectedSOPFiles(files);
  };

  const canProceedToSOPs = () => {
    return (selectedStandard !== null || selectedStandardFile.length > 0) && selectedGuidelineType !== '';
  };

  const canStartAnalysis = () => {
    return selectedSOPs.length > 0 || selectedSOPFiles.length > 0;
  };

  const handleNextStep = () => {
    if (canProceedToSOPs()) {
      setCurrentStep(2);
    }
  };

  const handleStartAnalysis = async () => {
    if (!canStartAnalysis()) {
      return;
    }

    try {
      setIsCreating(true);
      setIsLoading(true);
      
      // Prepare parameters for API call
      const guidelinesId = selectedStandard ? String(selectedStandard) : '';
      const guidelinesFiles = selectedStandardFile.length > 0 ? selectedStandardFile : undefined;
      const sopIds = selectedSOPs.length > 0 ? selectedSOPs.map(id => String(id)) : undefined;
      const sopFiles = selectedSOPFiles;
      const guidelinesType = selectedGuidelineType;
      const createdBy = userProfile?.name || '';
      
      // First go to Step 3 to show loading state
      setCurrentStep(3);
       
       const result = await createReportWithExistingGuidelines(
         guidelinesId,
         sopFiles,
         guidelinesFiles,
         sopIds,
         guidelinesType,
         createdBy
       );
       
       setCreatedReport(result);
       setIsLoading(false);
       
       // Change URL to show the created report
       if (result && result.generated_report_id) {
         window.history.pushState({}, '', `/compliance-ai/analysis/${result.generated_report_id}`);
       } else {
         window.history.pushState({}, '', '/compliance-ai/analysis');
       }
       
       // Reset form
       setSelectedStandard(null);
       setSelectedStandardFile([]);
       setSelectedGuidelineType('');
       setSelectedSOPs([]);
       setSelectedSOPFiles([]);
       
       Toast.notify({ type: 'success', message: t('complianceAi.messages.analysisStarted') });
    } catch (error) {
      Toast.notify({ type: 'error', message: t('complianceAi.messages.analysisFailed') });
      console.error('Analysis failed:', error);
    } finally {
      setIsCreating(false);
      setIsLoading(false);
    }
  };

  const handleBackToStep = (step: 1 | 2) => {
    setCurrentStep(step);
  };

  return (
    <div className='flex flex-col bg-components-panel-bg' style={{ height: 'calc(100vh - 56px)' }}>
      <TopBar activeIndex={currentStep - 1} />
      <br />
      <div className={`${styles.contentSection}`}>
        {/* Step 1: Standard */}
        {currentStep === 1 && (
          <div className='bg-white rounded-[20px] border border-gray-200 p-6'>
            {/* Select Standards */}
            <div className="mb-6">
              <h2 className={`text-md font-semibold mb-3 ${styles.textMainColor}`}>{t('complianceAi.newAnalysisPage.step1.title')}</h2>
              {isLoadingCurrentWorkspace || standardsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">{t('complianceAi.newAnalysisPage.step1.loadingStandards')}</p>
                </div>
              ) : standards.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t('complianceAi.newAnalysisPage.step1.noStandardsAvailable')}</p>
                </div>
              ) : (
                <div className="w-full">
                  <StandardSelect
                    standards={standards}
                    selectedStandard={selectedStandard}
                    onSelect={handleStandardSelect}
                    placeholder={t('complianceAi.standardSelect.placeholder')}
                  />
                </div>
              )}
            </div>

            {/* Select Guideline Type */}
            <div className="mb-6">
              <h2 className={`text-md font-semibold mb-3 ${styles.textMainColor}`}>{t('complianceAi.newAnalysisPage.step1.guidelineTypeTitle')}</h2>
              <div className="w-full">
                <GuidelineTypeSelect
                  selectedValue={selectedGuidelineType}
                  onSelect={setSelectedGuidelineType}
                  placeholder={t('complianceAi.guidelineTypeSelect.placeholder')}
                />
              </div>
            </div>

            {/* Upload Standards */}
            <div>
              <h2 className={`text-md font-semibold mb-3 ${styles.textMainColor}`}>{t('complianceAi.newAnalysisPage.step1.uploadTitle')}</h2>
              <FileUploader
                title={t('complianceAi.newAnalysisPage.step1.dragAndDrop')}
                acceptedTypes={t('complianceAi.newAnalysisPage.step1.acceptedTypes')}
                onFilesChange={handleStandardFilesChange}
                selectedFiles={selectedStandardFile}
              />
            </div>

            {/* Next Step Button */}
            <div className="flex justify-end pt-6">
              <Button 
                type="button" 
                variant="primary" 
                onClick={handleNextStep}
                disabled={!canProceedToSOPs()}
                className="px-8"
              >
                {t('complianceAi.newAnalysisPage.step1.nextStep')}
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: SOPs */}
        {currentStep === 2 && (
          <div className='bg-white rounded-[20px] border border-gray-200 p-6'>
            {/* Select SOPs */}
            <div className="mb-6">
              <h2 className={`text-md font-semibold mb-3 ${styles.textMainColor}`}>{t('complianceAi.newAnalysisPage.step2.title')}</h2>
              {isLoadingCurrentWorkspace || sopsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">{t('complianceAi.newAnalysisPage.step2.loadingSOPs')}</p>
                </div>
              ) : sops.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t('complianceAi.newAnalysisPage.step2.noSOPsAvailable')}</p>
                </div>
              ) : (
                <div className="w-full">
                  <SOPSelect
                    sops={sops}
                    selectedSOPs={selectedSOPs}
                    onSelect={handleSOPSelect}
                    placeholder={t('complianceAi.sopSelect.placeholder')}
                  />
                </div>
              )}
            </div>

            {/* Upload SOPs */}
            <div>
              <h2 className={`text-md font-semibold mb-3 ${styles.textMainColor}`}>{t('complianceAi.newAnalysisPage.step2.uploadTitle')}</h2>
              <FileUploader
                title={t('complianceAi.newAnalysisPage.step2.dragAndDrop')}
                acceptedTypes={t('complianceAi.newAnalysisPage.step2.acceptedTypes')}
                onFilesChange={handleSOPFilesChange}
                selectedFiles={selectedSOPFiles}
                existingFiles={sops.map(s => ({ fileName: s.fileName }))}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => handleBackToStep(1)}
                className="px-6"
              >
                {t('complianceAi.newAnalysisPage.step2.back')}
              </Button>
              <Button 
                type="button" 
                variant="primary" 
                onClick={handleStartAnalysis}
                disabled={!canStartAnalysis() || isCreating}
                className="px-8"
              >
                {isCreating ? t('complianceAi.newAnalysisPage.step2.creatingAnalysis') : t('complianceAi.newAnalysisPage.step2.startAnalysis')}
              </Button>
            </div>
          </div>
        )}

         {/* Step 3: Loading or Report */}
         {currentStep === 3 && (
           <div className="space-y-6">
             {isLoading ? (
               <div className="flex flex-col items-center justify-center py-16">
                 <Loading type="area" />
               </div>
             ) : createdReport ? (
               <>
                 <h2 className={`text-2xl font-bold ${styles.textMainColor}`}>{t('complianceAi.newAnalysisPage.step3.title')}</h2>
                 
                 {createdReport.created_at && (
                   <div className="text-gray-500 mb-4">
                     {t('complianceAi.newAnalysisPage.step3.assessmentDate')} {formatDate(createdReport.created_at)}
                   </div>
                 )}
                 
                 <ReportView report={createdReport} />
               </>
             ) : null}
           </div>
         )}
      </div>
    </div>
  );
};

export default NewAnalysisPage; 
