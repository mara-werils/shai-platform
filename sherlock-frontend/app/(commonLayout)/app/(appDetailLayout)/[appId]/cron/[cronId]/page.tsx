'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { RiArrowLeftLine } from '@remixicon/react'
import Button from '@/app/components/base/button'
import Loading from '@/app/components/base/loading'
import CronForm from '../components/CronForm'
import { useCronJob, useCronJobs } from '@/hooks/shai/use-cron-jobs'
import { convertFormDataToCronJob, CronFormData } from '../utils/cronUtils'

const EditCronPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useParams()
  const appId = params.appId as string
  const cronId = parseInt(params.cronId as string)
  
  const { cronJob, loading: jobLoading, error: jobError } = useCronJob(appId, cronId)
  const { updateJob } = useCronJobs(appId)
  const [loading, setLoading] = useState(false)

  const handleBack = () => {
    router.push(`/app/${appId}/cron`)
  }

  const handleSubmit = async (formData: CronFormData) => {
    setLoading(true)
    
    try {
      const cronJobData = convertFormDataToCronJob(formData, appId)
      await updateJob(cronId, cronJobData)
      router.push(`/app/${appId}/cron`)
    } catch (error) {
      console.error('Failed to update cron job:', error)
    } finally {
      setLoading(false)
    }
  }

  if (jobLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loading type="area" />
      </div>
    )
  }

  if (jobError || !cronJob) {
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
              Cron
            </h1>
          </div>
          <div className="text-center py-8">
            <p className="text-red-500">
              {jobError || t('appCron.editPage.notFound')}
            </p>
          </div>
        </div>
      </div>
    )
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
            {t('appCron.editPage.title')} {cronJob.name}
          </h1>
        </div>

        <CronForm
          initialData={cronJob}
          onSubmit={handleSubmit}
          loading={loading}
          submitText={t('appCron.editPage.submit')}
          loadingText={t('appCron.editPage.submitting')}
        />
      </div>
    </div>
  )
}

export default EditCronPage
