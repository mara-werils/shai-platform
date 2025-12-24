'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { RiArrowLeftLine } from '@remixicon/react'
import Button from '@/app/components/base/button'
import CronForm from '../components/CronForm'
import { useCronJobs } from '@/hooks/shai/use-cron-jobs'
import { convertFormDataToCronJob, CronFormData } from '../utils/cronUtils'

const NewCronPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useParams()
  const appId = params.appId as string
  
  const { createJob } = useCronJobs(appId)
  const [loading, setLoading] = useState(false)

  const handleBack = () => {
    router.push(`/app/${appId}/cron`)
  }

  const handleSubmit = async (formData: CronFormData) => {
    setLoading(true)
    
    try {
      const cronJobData = convertFormDataToCronJob(formData, appId)
      await createJob(cronJobData)
      router.push(`/app/${appId}/cron`)
    } catch (error) {
      console.error('Failed to create cron job:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative flex h-full flex-col overflow-y-auto bg-white'>
      <div className='flex flex-col gap-6 px-12 py-8'>

        <div className='flex items-center gap-4'>
          <Button 
            type="button" 
            variant="ghost" 
            onClick={handleBack}
            className="p-2"
          >
            <RiArrowLeftLine className="h-4 w-4" />
          </Button>
          <h1 className='text-2xl font-semibold text-text-tertiary'>
            {t('appCron.newPage.title')}
          </h1>
        </div>

        <CronForm
          onSubmit={handleSubmit}
          loading={loading}
          submitText={t('appCron.newPage.submit')}
          loadingText={t('appCron.newPage.submitting')}
        />
      </div>
    </div>
  )
}

export default NewCronPage
