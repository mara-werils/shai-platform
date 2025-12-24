'use client'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'
import { RiArrowLeftLine } from '@remixicon/react'
import Button from '@/app/components/base/button'
import LoginHistoryTable, { type LoginHistoryEntry } from './login-history-table'
import cn from '@/utils/classnames'
import { fetchMemberLoginLogs } from '@/service/shai/members'

type LoginHistoryPageProps = {
  userId?: string
  onBack?: () => void
}

const LoginHistoryPage = ({ userId, onBack }: LoginHistoryPageProps) => {
  const { t } = useTranslation()
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('weekly')

  const { data, isLoading } = useSWR(
    userId ? [userId, selectedTimeRange] : null,
    () => userId ? fetchMemberLoginLogs(userId, selectedTimeRange) : null,
  )

  return (
    <div className='mb-8'>
      <div className={cn('sticky top-0 z-20 mb-[18px] flex items-center bg-components-panel-bg pb-2 pt-[16px]')}>
        <div className='flex items-center gap-3'>
          {onBack && (
            <Button
              variant='ghost'
              className='p-1'
              onClick={onBack}
            >
              <RiArrowLeftLine className='h-5 w-5 text-text-secondary' />
            </Button>
          )}
          <div className='title-2xl-semi-bold text-text-primary'>{t('common.members.loginHistory')}</div>
        </div>
      </div>
      <LoginHistoryTable
        data={data?.logs || []}
        selectedTimeRange={selectedTimeRange}
        onTimeRangeChange={setSelectedTimeRange}
        isLoading={isLoading}
      />
    </div>
  )
}

export default LoginHistoryPage

