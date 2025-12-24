'use client'
import React from 'react'
import Modal from '@/app/components/base/modal'
import Button from '@/app/components/base/button'

export type PolicyBlockType = 'title' | 'subtitle' | 'text'

export interface PolicyBlock {
  type: PolicyBlockType
  text: string
}

interface PrivacyPolicyModalProps {
  isShow: boolean
  onClose: () => void
  title: string
  closeText: string
  content: PolicyBlock[]
}

const blockClassName = (type: PolicyBlockType) => {
  switch (type) {
    case 'title':
      return 'text-base font-semibold text-text-primary'
    case 'subtitle':
      return 'text-sm font-semibold text-text-primary mt-2'
    case 'text':
    default:
      return 'text-sm text-text-secondary'
  }
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isShow, onClose, title, closeText, content }) => (
  <Modal isShow={isShow} onClose={onClose} title={title} className="w-[900px] !max-w-[calc(100%-30px)]">
    <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pt-4 pr-3 whitespace-pre-line">
      {content.map((block, index) => (
        <p key={`${block.type}-${index}`} className={blockClassName(block.type)}>
          {block.text}
        </p>
      ))}
    </div>
    <div className="flex justify-end mt-6">
      <Button variant="primary" onClick={onClose}>
        {closeText}
      </Button>
    </div>
  </Modal>
)

export default PrivacyPolicyModal

