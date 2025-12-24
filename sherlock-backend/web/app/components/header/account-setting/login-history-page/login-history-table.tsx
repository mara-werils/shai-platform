'use client'
import { useContext } from 'use-context-selector'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { RiCalendarLine, RiArrowDownSLine } from '@remixicon/react'
import I18n from '@/context/i18n'
import { SimpleSelect } from '@/app/components/base/select'
import type { Item } from '@/app/components/base/select'
import type { MemberLoginLog } from '@/service/shai/members'
import Loading from '@/app/components/base/loading'
import LoginStatusBadge from './login-status-badge'

export type LoginHistoryEntry = MemberLoginLog

type LoginHistoryTableProps = {
  data: LoginHistoryEntry[]
  selectedTimeRange?: string
  onTimeRangeChange?: (value: string) => void
  isLoading?: boolean
}

const LoginHistoryTable = ({ data, selectedTimeRange = 'weekly', onTimeRangeChange, isLoading = false }: LoginHistoryTableProps) => {
  const { t } = useTranslation()
  const { locale } = useContext(I18n)

  const timeRangeOptions: Item[] = [
    { value: 'daily', name: t('common.members.timeRangeToday') },
    { value: 'weekly', name: t('common.members.timeRange7Days') },
    { value: 'two_weeks', name: t('common.members.timeRange14Days') },
    { value: 'monthly', name: t('common.members.timeRange1Month') },
    { value: 'three_months', name: t('common.members.timeRange3Months') },
    { value: 'half_year', name: t('common.members.timeRange6Months') },
    { value: 'yearly', name: t('common.members.timeRange1Year') },
    { value: 'all', name: t('common.members.timeRangeAll') },
  ]

  const formatDate = (timestamp: number) => {
    return dayjs(timestamp * 1000)
      .locale(locale === 'zh-Hans' ? 'zh-cn' : 'en')
      .format('DD.MM.YYYY, HH:mm')
  }

  const handleTimeRangeSelect = (item: Item) => {
    onTimeRangeChange?.(item.value as string)
  }

  return (
    <div>
      <div className='mb-4 inline-block min-w-[240px]'>
        <SimpleSelect
          defaultValue={selectedTimeRange}
          items={timeRangeOptions}
          onSelect={handleTimeRangeSelect}
          wrapperClassName='[&_button]:!w-auto'
          renderTrigger={(selectedItem) => (
            <div className='flex h-9 items-center rounded-lg border border-[#E7E8EA] bg-[#F9FAFB] pl-3 pr-2 sm:text-sm sm:leading-6 cursor-pointer'>
              <RiCalendarLine className='mr-2 h-4 w-4 shrink-0 text-text-tertiary' />
              <span className='block truncate text-left system-sm-regular text-components-input-text-filled whitespace-nowrap'>
                {selectedItem?.name ?? t('common.members.timeRange7Days')}
              </span>
              <RiArrowDownSLine className='ml-2 h-4 w-4 shrink-0 text-text-quaternary' />
            </div>
          )}
        />
      </div>
      <div className='overflow-visible lg:overflow-visible'>
        <div className='flex w-full min-w-[480px] items-center border-divider-regular bg-[#F7F7F9] py-3 rounded-md'>
          <div className='system-xs-medium-uppercase flex-1 shrink-0 px-3 text-text-tertiary'>{t('common.members.date')}</div>
          <div className='system-xs-medium-uppercase flex-1 shrink-0 px-3 text-text-tertiary'>{t('common.members.ip')}</div>
          <div className='system-xs-medium-uppercase flex-1 shrink-0 px-3 text-text-tertiary'>{t('common.members.status')}</div>
        </div>
        <div className='relative w-full min-w-[480px] max-h-[480px] overflow-y-auto'>
          {isLoading ? (
            <div className='flex items-center justify-center py-8'>
              <Loading />
            </div>
          ) : data.length === 0 ? (
            <div className='flex items-center justify-center py-8 text-text-tertiary'>
              {t('common.members.noData')}
            </div>
          ) : (
            data.map((entry) => (
              <div key={entry.id} className='flex w-full items-center border-b border-divider-subtle'>
                <div className='system-sm-regular flex flex-1 shrink-0 items-center px-3 py-5 text-text-secondary'>
                  {formatDate(entry.created_at)}
                </div>
                <div className='system-sm-regular flex flex-1 shrink-0 items-center px-3 py-5 text-text-secondary'>
                  {entry.ip_address}
                </div>
                <div className='system-sm-regular flex flex-1 shrink-0 items-center px-3 py-5 text-text-secondary'>
                  <LoginStatusBadge status={entry.is_successful ? 'success' : 'error'} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginHistoryTable

