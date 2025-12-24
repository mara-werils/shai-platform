'use client'
import React, { useMemo, useState } from 'react'
import Modal from '@/app/components/base/modal'
import Button from '@/app/components/base/button'
import '../signin.css'
import { RiArrowRightUpLine } from '@remixicon/react'
import { useTranslation } from 'react-i18next'
import PrivacyPolicyModal, { PolicyBlock } from './PrivacyPolicyModal'

interface DataProtectionModalProps {
  isShow: boolean
  onClose: () => void
  onConfirm: () => void
  className?: string
}

const DataProtectionModal: React.FC<DataProtectionModalProps> = ({ isShow, onClose, onConfirm, className = '' }) => {
  const { t } = useTranslation()
  const [showPolicy, setShowPolicy] = useState(false)
  const policyContent = useMemo(() => {
    const raw = t('dataProtection.policyContent', { returnObjects: true }) as unknown
    if (!Array.isArray(raw)) {
      return []
    }
    return raw.filter((item): item is PolicyBlock => {
      if (!item || typeof item !== 'object') {
        return false
      }
      const { type, text } = item as PolicyBlock
      return (type === 'title' || type === 'subtitle' || type === 'text') && typeof text === 'string'
    })
  }, [t])
  return (
    <>
      <Modal
        isShow={isShow}
        onClose={onClose}
        title={t('dataProtection.modalTitle')}
        className={`data-protection-modal w-[800px] !max-w-[calc(100%-30px)] ${className}`}
      >
        <div className="dp-modal-content flex flex-col items-start py-2 px-1">
          <div className="dp-grey-block w-full mt-4 mb-5">
            <div className="dp-modal-image mb-4 flex w-full">
              <img src="/signin/data-protection.svg" alt={t('dataProtection.heading')} className="object-contain mr-3" />
            </div>
            <div className="dp-modal-label font-medium mb-1">{t('dataProtection.heading')}</div>
            <div className="dp-modal-desc text-text-secondary text-sm mb-4">
              {t('dataProtection.descLine1')}
              <br />
              {t('dataProtection.descLine2')}
            </div>
            <button
              type="button"
              className="dp-modal-policy flex items-center gap-1 text-components-button-secondary-accent-text text-sm font-medium hover:underline"
              onClick={() => setShowPolicy(true)}
            >
              {t('dataProtection.linkText')}
              <RiArrowRightUpLine className="h-4 w-4" />
            </button>
          </div>
          <div className="dp-modal-buttons flex w-full justify-end gap-2">
            <Button variant="secondary" className="dp-modal-exit-btn" onClick={onClose}>
              {t('dataProtection.exit')}
            </Button>
            <Button variant="primary" className="dp-modal-confirm-btn" onClick={onConfirm}>
              {t('dataProtection.agree')}
            </Button>
          </div>
        </div>
      </Modal>
      <PrivacyPolicyModal
        isShow={showPolicy}
        onClose={() => setShowPolicy(false)}
        title={t('dataProtection.policyModalTitle')}
        closeText={t('dataProtection.policyModalClose')}
        content={policyContent}
      />
    </>
  )
}

export default DataProtectionModal
