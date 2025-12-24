'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RiAddLine } from '@remixicon/react'
import Input from '@/app/components/base/input'
import Button from '@/app/components/base/button'
import CronTable from './CronTable'
import { useCronJobs } from '@/hooks/shai/use-cron-jobs'
import { useParams, useRouter } from 'next/navigation'

const CronMain = () => {
  const { t } = useTranslation()
  const [searchKeyword, setSearchKeyword] = useState('')
  const params = useParams()
  const router = useRouter()
  const appId = params.appId as string
  
  const { createJob } = useCronJobs(appId)

  const handleCreateNew = () => {
    router.push(`/app/${appId}/cron/new`)
  }

  const handleSearchChange = (value: string) => {
    setSearchKeyword(value)
  }

  return (
    <div className='relative flex h-full flex-col overflow-y-auto bg-white'>
      <div className='flex flex-col gap-6 px-12 py-8'>

        <div className='flex flex-col gap-2'>
          <div className='text-2xl font-semibold'>
            {t('appCron.title')}
          </div>
          <div className='text-sm text-text-tertiary'>
            {t('appCron.description')}
          </div>
        </div>

        <div className='flex items-center justify-between gap-4'>
          <div className='flex-1 max-w-md'>
            <Input
              showLeftIcon
              placeholder={t('appCron.search')}
              value={searchKeyword}
              onChange={e => handleSearchChange(e.target.value)}
            />
          </div>
          <Button
            variant='primary'
            onClick={handleCreateNew}
          >
            <RiAddLine className='mr-1 h-4 w-4' />
            {t('appCron.createNew')}
          </Button>
        </div>

        <div className='flex-1'>
          <CronTable searchKeyword={searchKeyword} />
        </div>
      </div>
    </div>
  )
}

export default CronMain
