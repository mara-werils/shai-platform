'use client'

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '@/app/components/base/modal';
import Button from '@/app/components/base/button';
import { RiLoader2Line } from '@remixicon/react';

interface RenameModalProps {
  open: boolean;
  onClose: () => void;
  currentName: string;
  onRename: (newName: string) => Promise<void>;
}

const RenameModal = ({ open, onClose, currentName, onRename }: RenameModalProps) => {
  const { t } = useTranslation();
  const [newName, setNewName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);

  useEffect(() => {
    if (open) {
      setNewName(currentName);
      setIsRenaming(false);
    }
  }, [open, currentName]);

  const handleSave = async () => {
    if (!newName.trim()) return;

    try {
      setIsRenaming(true);
      await onRename(newName.trim());
      onClose();
    } catch (error) {
      console.error('Rename failed:', error);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleCancel = () => {
    setNewName(currentName);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isRenaming) {
      handleSave();
    }
  };

  return (
    <Modal isShow={open} onClose={handleCancel}>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t('complianceAi.analysisTable.rename')}
        </h3>
        
        <div className="mb-6">
          <label htmlFor="report-name" className="block text-sm font-medium text-gray-700 mb-2">
            {t('complianceAi.analysisTable.reportName')}
          </label>
          <input
            id="report-name"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={t('complianceAi.messages.renameConfirm')}
            disabled={isRenaming}
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isRenaming}
          >
            {t('complianceAi.actions.cancel')}
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSave}
            disabled={!newName.trim() || isRenaming}
          >
            {isRenaming ? (
              <>
                <RiLoader2Line className="mr-2 h-4 w-4 animate-spin" />
                {t('complianceAi.actions.loading')}
              </>
            ) : (
              t('complianceAi.actions.save')
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RenameModal;
