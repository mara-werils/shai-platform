'use client'

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FullScreenModal from '@/app/components/base/fullscreen-modal';
import Button from '@/app/components/base/button';
import { RiLoader2Line } from '@remixicon/react';
import { useComplianceStandards } from '@/hooks/shai/use-compliance-standards';
import { useComplianceSOPs } from '@/hooks/shai/use-compliance-sops';
import { useAppContext } from '@/context/app-context';
import FileUploader from './components/FileUploader';
import styles from './UploadModal.module.css';
import Toast from '@/app/components/base/toast';
import { emitEvent, EVENTS } from './utils/event-emitter';

type UploadType = 'standards' | 'sops';

const UploadModal = ({ 
  open, 
  onClose,
  type = 'standards'
}: { 
  open: boolean; 
  onClose: () => void;
  type?: UploadType;
}) => {
  const { t } = useTranslation();
  const { currentWorkspace, userProfile } = useAppContext();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { uploadStandard } = useComplianceStandards(currentWorkspace.id);
  const { uploadSOP, sops } = useComplianceSOPs(currentWorkspace.id);
  const [isUploading, setIsUploading] = useState(false);

  const existingFiles = type === 'sops' 
    ? sops.map(s => ({ fileName: s.fileName }))
    : [];

  const handleFilesChange = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleSave = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setIsUploading(true);
      const userName = userProfile?.name || '';
      
      if (type === 'standards') {
        await uploadStandard(selectedFiles, userName);
        emitEvent(EVENTS.STANDARDS_UPDATED);
        Toast.notify({ type: 'success', message: t('complianceAi.uploadModal.standardsUploaded') });
      } else {
        await uploadSOP(selectedFiles, userName);
        emitEvent(EVENTS.SOPS_UPDATED);
        Toast.notify({ type: 'success', message: t('complianceAi.uploadModal.sopsUploaded') });
      }
      
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      const errorMessage = type === 'standards' 
        ? t('complianceAi.uploadModal.uploadStandardsError')
        : t('complianceAi.uploadModal.uploadSOPsError');
      Toast.notify({ type: 'error', message: errorMessage });
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    onClose();
  };

  const getModalTitle = () => {
    return type === 'standards' ? t('complianceAi.uploadModal.uploadStandard') : t('complianceAi.uploadModal.uploadSOP');
  };

  return (
    <FullScreenModal open={open} onClose={handleCancel} closable={true}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className={`text-2xl font-semibold ${styles.modalTitle}`}>
            {getModalTitle()}
          </h2>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <FileUploader
              title={t('complianceAi.fileUploader.dragAndDrop')}
              onFilesChange={handleFilesChange}
              selectedFiles={selectedFiles}
              existingFiles={existingFiles}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleCancel}
                disabled={isUploading}
              >
                {t('complianceAi.uploadModal.cancel')}
              </Button>
              <Button 
                type="button" 
                variant="primary" 
                onClick={handleSave}
                disabled={selectedFiles.length === 0 || isUploading}
              >
                {isUploading ? (
                  <>
                    <RiLoader2Line className={`mr-2 h-4 w-4 animate-spin`} />
                    {t('complianceAi.uploadModal.uploading')}
                  </>
                ) : (
                  t('complianceAi.uploadModal.save')
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </FullScreenModal>
  );
};

export default UploadModal; 