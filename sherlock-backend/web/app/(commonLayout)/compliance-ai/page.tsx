'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import Button from '@/app/components/base/button'
import TabSliderNew from '@/app/components/base/tab-slider-new'
import UploadModal from './UploadModal'
import StandardsTable from './StandardsTable'
import SOPsTable from './SOPsTable'
import styles from './styles.module.css'
import {
  RiAddLine,
  RiDatabase2Line,
  RiFileChartLine,
} from '@remixicon/react'

const ComplianceAIPage = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const [tab, setTab] = useState('standards')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadType, setUploadType] = useState<'standards' | 'sops'>('standards')

  const mainOptions = [
    { value: 'analysis', text: t('complianceAi.navigation.analysis'), icon: <RiFileChartLine className='mr-2 h-4 w-4' /> },
    { value: 'storage', text: t('complianceAi.navigation.storage'), icon: <RiDatabase2Line className='mr-2 h-4 w-4' /> },
  ]

  const subOptions = [
    { value: 'standards', text: t('complianceAi.mainPage.standards') },
    { value: 'sops', text: t('complianceAi.mainPage.sops') },
  ]

  const handleMainTabChange = (value: string) => {
    if (value === 'analysis')
      router.push('/compliance-ai/analysis')
  }

  const handleSubTabChange = (value: string) => {
    setTab(value);
    setUploadType(value as 'standards' | 'sops');
  }

  const handleUploadClick = () => {
    setUploadType(tab as 'standards' | 'sops');
    setUploadOpen(true);
  }

  return (
    <div className='scroll-container relative flex grow flex-col overflow-y-auto bg-background-body'>
      <div className={`${styles.navigationHeader} flex flex-wrap items-center justify-between gap-y-2`}>
        <TabSliderNew
          value="storage"
          onChange={handleMainTabChange}
          options={mainOptions}
        />
      </div>

      <div className={styles.headerSection}>
        <h1 className={`${styles.pageTitle}`}>{t('complianceAi.mainPage.title')}</h1>
        <p className={`${styles.pageDescription}`}>
          {t('complianceAi.mainPage.description')}
        </p>
      </div>

      <div className={`${styles.contentHeader} flex flex-wrap items-center justify-between gap-y-2`}>
        <TabSliderNew
          value={tab}
          onChange={handleSubTabChange}
          options={subOptions}
        />
        <div className='flex items-center gap-2'>
          <Button
            type="button"
            variant="primary"
            onClick={handleUploadClick}
          >
            <RiAddLine className='mr-2 h-4 w-4' />
            {t('complianceAi.mainPage.uploadDocument')}
          </Button>
          <UploadModal
            open={uploadOpen}
            onClose={() => setUploadOpen(false)}
            type={uploadType}
          />
        </div>
      </div>

      {/* Content [Tabs] */}
      <div className={styles.contentSection}>
        {tab === 'standards' ? <StandardsTable /> : <SOPsTable />}
      </div>
    </div>
  )
}

export default ComplianceAIPage
