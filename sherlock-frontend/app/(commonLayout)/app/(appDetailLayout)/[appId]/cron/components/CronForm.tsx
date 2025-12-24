'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/app/components/base/button'
import Input from '@/app/components/base/input'
import PureSelect from '@/app/components/base/select/pure'
import { CronJob } from '@/service/shai/cron'
import { getFrequencyOptions, getMonthOptions, getWeekDayOptions, getStatusOptions, CronFormData, getDaysInMonth, convertPayloadToLocalPayload } from '../utils/cronUtils'
import KeyValueList from './KeyValueList'

interface CronFormProps {
  initialData?: CronJob
  onSubmit: (data: CronFormData) => Promise<void>
  loading: boolean
  submitText: string
  loadingText: string
}

const CronForm: React.FC<CronFormProps> = ({
  initialData,
  onSubmit,
  loading,
  submitText,
  loadingText
}) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<CronFormData>({
    name: '',
    frequency: 'every-minute',
    hour: '00',
    minute: '00',
    dayOfWeek: '0',
    dayOfMonth: '1',
    month: '1',
    localPayload: [{ key: '', value: '' }],
    status: 'active'
  })

  useEffect(() => {
    if (initialData) {
      // Определяем frequency на основе schedule
      let frequency: CronFormData['frequency'] = 'every-minute'
      let dayOfWeek = '0'
      let dayOfMonth = '1'
      let month = '1'
      
      if (initialData.schedule) {
        if (initialData.schedule === '* * * * *') frequency = 'every-minute'
        else if (initialData.schedule === '0 * * * *') frequency = 'every-hour'
        else if (initialData.schedule.match(/^\*\/\d+ \* \* \* \*$/)) frequency = 'every-minute'
        else if (initialData.schedule.match(/^\d+ \d+ \* \* \*$/)) frequency = 'every-day'
        else if (initialData.schedule.match(/^\d+ \d+ \* \* \d$/)) {
          frequency = 'every-week'
          const parts = initialData.schedule.split(' ')
          if (parts.length >= 5) dayOfWeek = parts[4]
        }
        else if (initialData.schedule.match(/^\d+ \d+ \d+ \* \*$/)) {
          frequency = 'every-month'
          const parts = initialData.schedule.split(' ')
          if (parts.length >= 3) dayOfMonth = parts[2]
        }
        else if (initialData.schedule.match(/^\d+ \d+ \d+ \d+ \*$/)) {
          frequency = 'every-year'
          const parts = initialData.schedule.split(' ')
          if (parts.length >= 4) {
            dayOfMonth = parts[2]
            month = parts[3]
          }
        }
      }

      // Извлекаем час и минуту из schedule
      let hour = '00'
      let minute = '00'
      if (initialData.schedule && initialData.schedule !== '* * * * *' && initialData.schedule !== '0 * * * *' && !initialData.schedule.match(/^\*\/\d+ \* \* \* \*$/)) {
        const parts = initialData.schedule.split(' ')
        if (parts.length >= 2 && !parts[0].includes('*') && !parts[1].includes('*')) {
          minute = parts[0].padStart(2, '0')
          hour = parts[1].padStart(2, '0')
        }
      }

      setFormData({
        name: initialData.name,
        frequency,
        hour,
        minute,
        dayOfWeek,
        dayOfMonth,
        month,
        localPayload: initialData.payload ? convertPayloadToLocalPayload(initialData.payload) : [{ key: '', value: '' }],
        status: initialData.is_active ? 'active' : 'inactive'
      })
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const showTimeInputs = ['every-day', 'every-week', 'every-month', 'every-year'].includes(formData.frequency)

  useEffect(() => {
    if (formData.frequency === 'every-year') {
      const month = parseInt(formData.month)
      const currentDay = parseInt(formData.dayOfMonth)
      const maxDays = getDaysInMonth(month)
      
      if (currentDay > maxDays) {
        setFormData(prev => ({ ...prev, dayOfMonth: '1' }))
      }
    }
  }, [formData.month, formData.frequency])

  return (
    <div className='w-full max-w-[860px]'>
      <form onSubmit={handleSubmit} className='space-y-6'>

        <div className='flex'>
          <div className='flex items-center shrink-0 w-[180px] h-9'>
            <div className='system-sm-semibold text-text-secondary'>{t('appCron.form.name')}</div>
          </div>
          <div className='grow'>
            <Input
              placeholder={t('appCron.form.namePlaceholder')}
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className='flex'>
          <div className='flex items-center shrink-0 w-[180px] h-9'>
            <div className='system-sm-semibold text-text-secondary'>{t('appCron.form.frequency')}</div>
          </div>
          <div className='grow'>
            <PureSelect
              options={getFrequencyOptions(t)}
              value={formData.frequency}
              onChange={value => setFormData(prev => ({ ...prev, frequency: value as CronFormData['frequency'] }))}
            />
          </div>
        </div>

        {/* Месяц - только для ежегодного расписания */}
        {formData.frequency === 'every-year' && (
          <div className='flex'>
            <div className='flex items-center shrink-0 w-[180px] h-9'>
              <div className='system-sm-semibold text-text-secondary'>{t('appCron.form.month')}</div>
            </div>
            <div className='grow'>
              <PureSelect
                options={getMonthOptions(t)}
                value={formData.month}
                onChange={value => setFormData(prev => ({ ...prev, month: value }))}
                popupProps={{
                  className: 'max-h-[200px] overflow-y-auto'
                }}
              />
            </div>
          </div>
        )}

        {/* День месяца - только для ежемесячного и ежегодного расписания */}
        {(formData.frequency === 'every-month' || formData.frequency === 'every-year') && (
          <div className='flex'>
            <div className='flex items-center shrink-0 w-[180px] h-9'>
              <div className='system-sm-semibold text-text-secondary'>{t('appCron.form.dayOfMonth')}</div>
            </div>
            <div className='grow'>
              <PureSelect
                options={(() => {
                  let daysInMonth = 31
                  
                  if (formData.frequency === 'every-year') {
                    const month = parseInt(formData.month)
                    daysInMonth = getDaysInMonth(month)
                  }
                  
                  return Array.from({ length: daysInMonth }, (_, i) => ({
                    value: (i + 1).toString(),
                    label: (i + 1).toString()
                  }))
                })()}
                value={(() => {
                  const currentDay = parseInt(formData.dayOfMonth)
                  let maxDays = 31
                  
                  if (formData.frequency === 'every-year') {
                    const month = parseInt(formData.month)
                    maxDays = getDaysInMonth(month)
                  }
                  
                  if (currentDay > maxDays) {
                    setFormData(prev => ({ ...prev, dayOfMonth: '1' }))
                    return '1'
                  }
                  
                  return formData.dayOfMonth
                })()}
                onChange={value => setFormData(prev => ({ ...prev, dayOfMonth: value }))}
                popupProps={{
                  className: 'max-h-[200px] overflow-y-auto'
                }}
              />
            </div>
          </div>
        )}

        {/* День недели - только для еженедельного расписания */}
        {formData.frequency === 'every-week' && (
          <div className='flex'>
            <div className='flex items-center shrink-0 w-[180px] h-9'>
              <div className='system-sm-semibold text-text-secondary'>{t('appCron.form.dayOfWeek')}</div>
            </div>
            <div className='grow'>
              <PureSelect
                options={getWeekDayOptions(t)}
                value={formData.dayOfWeek}
                onChange={value => setFormData(prev => ({ ...prev, dayOfWeek: value }))}
              />
            </div>
          </div>
        )}

        {showTimeInputs && (
          <div className='flex'>
            <div className='flex items-center shrink-0 w-[180px] h-9'>
              <div className='system-sm-semibold text-text-secondary'>{t('appCron.form.executionTime')}</div>
            </div>
            <div className='grow flex gap-4'>
              <div className='flex-1'>
                <div className='system-xs-regular text-text-tertiary mb-1'>{t('appCron.form.hour')}</div>
                <PureSelect
                  options={Array.from({ length: 24 }, (_, i) => ({
                    value: i.toString().padStart(2, '0'),
                    label: i.toString().padStart(2, '0')
                  }))}
                  value={formData.hour}
                  onChange={value => setFormData(prev => ({ ...prev, hour: value }))}
                  popupProps={{
                    className: 'max-h-[200px] overflow-y-auto'
                  }}
                />
              </div>
              <div className='flex-1'>
                <div className='system-xs-regular text-text-tertiary mb-1'>{t('appCron.form.minute')}</div>
                <PureSelect
                  options={Array.from({ length: 60 }, (_, i) => ({
                    value: i.toString().padStart(2, '0'),
                    label: i.toString().padStart(2, '0')
                  }))}
                  value={formData.minute}
                  onChange={value => setFormData(prev => ({ ...prev, minute: value }))}
                  popupProps={{
                    className: 'max-h-[200px] overflow-y-auto'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div className='flex'>
          <div className='flex items-start shrink-0 w-[180px] pt-2'>
            <div className='system-sm-semibold text-text-secondary'>{t('appCron.form.inputData')}</div>
          </div>
          <div className='grow'>
            <KeyValueList
              value={formData.localPayload}
              onChange={value => setFormData(prev => ({ ...prev, localPayload: value }))}
            />
          </div>
        </div>

        {/* Статус - только для редактирования */}
        {initialData && (
          <div className='flex'>
            <div className='flex items-center shrink-0 w-[180px] h-9'>
              <div className='system-sm-semibold text-text-secondary'>{t('appCron.form.status')}</div>
            </div>
            <div className='grow'>
              <PureSelect
                options={getStatusOptions(t)}
                value={formData.status}
                onChange={value => setFormData(prev => ({ ...prev, status: value as 'active' | 'inactive' }))}
              />
            </div>
          </div>
        )}

        <div className='flex'>
          <div className='flex items-center shrink-0 w-[180px] h-9' />
          <div className='grow'>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !formData.name}
              className="min-w-24"
            >
              {loading ? loadingText : submitText}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CronForm
