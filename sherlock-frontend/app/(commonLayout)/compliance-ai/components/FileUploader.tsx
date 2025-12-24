'use client'

import React, { useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { RiUploadCloud2Line, RiDeleteBin6Line } from '@remixicon/react';
import { FileTypeIcon } from '@/app/components/base/file-uploader';
import { extensionToFileType } from '@/app/components/datasets/hit-testing/utils/extension-to-file-type';
import { getFileExtension } from '@/app/components/base/file-uploader/utils';
import { formatFileSize } from '@/utils/format';
import { COMPLIANCE_FILE_SIZE_LIMIT } from '@/app/components/base/file-uploader/constants';
import { useToastContext } from '@/app/components/base/toast';
import styles from '../UploadModal.module.css';

interface FileUploaderProps {
  title?: string;
  description?: string;
  acceptedTypes?: string;
  maxFileSize?: string;
  multiple?: boolean;
  onFilesChange: (files: File[]) => void;
  selectedFiles: File[];
  className?: string;
  existingFiles?: Array<{ fileName: string }>;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  title,
  description,
  acceptedTypes,
  maxFileSize = "100MB",
  multiple = true,
  onFilesChange,
  selectedFiles,
  className = "",
  existingFiles = []
}) => {
  const { t } = useTranslation();
  const { notify } = useToastContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Use provided props or fallback to translations
  const displayTitle = title || t('complianceAi.fileUploader.dragAndDrop');
  const displayDescription = description || t('complianceAi.fileUploader.description');
  const displayAcceptedTypes = acceptedTypes || t('complianceAi.fileUploader.acceptedTypes');

  const handleBrowse = () => {
    inputRef.current?.click();
  };

  const validateFile = useCallback((file: File): boolean => {
    const isValidSize = file.size <= COMPLIANCE_FILE_SIZE_LIMIT;
    
    if (!isValidSize) {
      notify({
        type: 'error',
        message: t('complianceAi.validation.fileTooLarge', { 
          fileName: file.name,
          maxSize: formatFileSize(COMPLIANCE_FILE_SIZE_LIMIT)
        })
      });
      return false;
    }

    const fileExtension = getFileExtension(file.name, file.type).toUpperCase();
    const allowedExtensions = ['DOC', 'DOCX', 'PDF'];
    const isValidType = allowedExtensions.includes(fileExtension);
    
    if (!isValidType) {
      notify({
        type: 'error',
        message: t('common.fileExtensionNotSupport')
      });
      return false;
    }
    
    return true;
  }, [notify, t]);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter(validateFile);

    if (validFiles.length > 0) {
      onFilesChange([...selectedFiles, ...validFiles]);
    }

    // Сброс input для возможности повторного выбора того же файла
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [validateFile, onFilesChange, selectedFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, []);

  const removeFile = (index: number) => {
    onFilesChange(selectedFiles.filter((_, i) => i !== index));
  };

  const isDuplicate = (fileName: string) => {
    return existingFiles.some(existing => existing.fileName === fileName);
  };

  return (
    <div className={className}>
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center mb-6 cursor-pointer transition-colors ${styles.dragAndDropMainBlock} 
          ${isDragOver 
            ? `border-blue-400 bg-blue-50` 
            : 'border-gray-300 hover:border-blue-400'
          }
        `}
        onClick={handleBrowse}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-center mb-3">
          <RiUploadCloud2Line className="h-5 w-5 text-gray-400 mr-2" />
          <span className={`text-sm ${styles.dragAndDropText}`}>
            {displayTitle}{' '}
            <span className="cursor-pointer">{t('complianceAi.fileUploader.browse')}</span>
          </span>
        </div>
        {displayDescription && (
          <p className="text-xs text-gray-500 mb-2">
            {displayDescription}
          </p>
        )}
        <p className={`text-xs text-gray-500 ${styles.typesText}`}>
          {displayAcceptedTypes}
        </p>
        <input 
          ref={inputRef} 
          type="file" 
          style={{ display: 'none' }} 
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          accept=".doc,.docx,.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className={`mb-6 ${styles.fileList}`}>
          <h3 className="text-sm font-medium text-gray-700 mb-2">{t('complianceAi.fileUploader.selectedFiles')}</h3>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="space-y-2">
                <div className={`flex items-center gap-3 rounded ${styles.fileItem} ${isDuplicate(file.name) ? styles.exist : ''}`}>
                  <div className={`flex-shrink-0`}>
                    <FileTypeIcon 
                      type={extensionToFileType(file.name.split('.').pop() || '')} 
                      size="md"
                    />
                  </div>
                  <div className={`flex-1 min-w-0`}>
                    <div className={`text-sm font-medium truncate ${styles.fileName}`}>
                      {file.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={styles.fileExtension}>
                        {getFileExtension(file.name, file.type).toUpperCase()}
                      </span>
                      <span>•</span>
                      <span className={styles.fileSize}>
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  </div>
                  <button 
                    className={`p-1 rounded hover:bg-red-50 transition-colors ${styles.removeButton}`}
                    onClick={() => removeFile(index)}
                    title={t('complianceAi.fileUploader.removeFile')}
                  >
                    <RiDeleteBin6Line className="w-4 h-4" />
                  </button>
                </div>
                {isDuplicate(file.name) && (
                  <div className={styles.duplicateWarning}>
                    {t('complianceAi.fileUploader.duplicateWarning')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader; 