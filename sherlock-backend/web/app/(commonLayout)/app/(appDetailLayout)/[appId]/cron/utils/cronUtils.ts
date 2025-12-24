export interface LocalPayloadItem {
  key: string
  value: string
}

export interface CronFormData {
  name: string
  frequency: 'every-minute' | 'every-hour' | 'every-day' | 'every-week' | 'every-month' | 'every-year'
  hour: string
  minute: string
  dayOfWeek: string
  dayOfMonth: string
  month: string
  localPayload: LocalPayloadItem[]
  status: 'active' | 'inactive'
}

export const getFrequencyOptions = (t: (key: string) => string) => [
  { value: 'every-minute', label: t('appCron.frequencies.everyMinute') },
  { value: 'every-hour', label: t('appCron.frequencies.everyHour') },
  { value: 'every-day', label: t('appCron.frequencies.everyDay') },
  { value: 'every-week', label: t('appCron.frequencies.everyWeek') },
  { value: 'every-month', label: t('appCron.frequencies.everyMonth') },
  { value: 'every-year', label: t('appCron.frequencies.everyYear') }
]

export const getMonthOptions = (t: (key: string) => string) => [
  { value: '1', label: t('appCron.months.january') },
  { value: '2', label: t('appCron.months.february') },
  { value: '3', label: t('appCron.months.march') },
  { value: '4', label: t('appCron.months.april') },
  { value: '5', label: t('appCron.months.may') },
  { value: '6', label: t('appCron.months.june') },
  { value: '7', label: t('appCron.months.july') },
  { value: '8', label: t('appCron.months.august') },
  { value: '9', label: t('appCron.months.september') },
  { value: '10', label: t('appCron.months.october') },
  { value: '11', label: t('appCron.months.november') },
  { value: '12', label: t('appCron.months.december') }
]

export const getWeekDayOptions = (t: (key: string) => string) => [
  { value: '0', label: t('appCron.weekDays.sunday') },
  { value: '1', label: t('appCron.weekDays.monday') },
  { value: '2', label: t('appCron.weekDays.tuesday') },
  { value: '3', label: t('appCron.weekDays.wednesday') },
  { value: '4', label: t('appCron.weekDays.thursday') },
  { value: '5', label: t('appCron.weekDays.friday') },
  { value: '6', label: t('appCron.weekDays.saturday') }
]

export const getStatusOptions = (t: (key: string) => string) => [
  { value: 'active', label: t('appCron.form.statusActive') },
  { value: 'inactive', label: t('appCron.form.statusInactive') }
]

// get days in month
export const getDaysInMonth = (month: number): number => {
  if (month === 2) {
    return 28
  } else if ([4, 6, 9, 11].includes(month)) {
    return 30
  }
  return 31
}

// validate date
const validateDate = (dayOfMonth: string, month: string): string => {
  const day = parseInt(dayOfMonth)
  const monthNum = parseInt(month)
  const maxDays = getDaysInMonth(monthNum)
  
  if (day > maxDays) {
    return '1'
  }
  
  return dayOfMonth
}

export const generateCronExpression = (formData: CronFormData): string => {
  switch (formData.frequency) {
    case 'every-minute':
      return '* * * * *'
    case 'every-hour':
      return '0 * * * *'
    case 'every-day':
      return `${formData.minute} ${formData.hour} * * *`
    case 'every-week':
      return `${formData.minute} ${formData.hour} * * ${formData.dayOfWeek}`
    case 'every-month':
      return `${formData.minute} ${formData.hour} ${formData.dayOfMonth} * *`
    case 'every-year':
      const validatedDay = validateDate(formData.dayOfMonth, formData.month)
      return `${formData.minute} ${formData.hour} ${validatedDay} ${formData.month} *`
    default:
      return '* * * * *'
  }
}



export const generateNextRunTime = (): string => {
  const now = new Date()
  const nextRun = new Date(now.getTime() + 60000)
  return nextRun.toISOString().slice(0, 19).replace('T', ' ')
}

export const convertFormDataToCronJob = (formData: CronFormData, appId: string) => {
  // localPayload to payload
  const payload: Record<string, any> = {}
  formData.localPayload.forEach(item => {
    const trimmedKey = item.key.trim()
    if (trimmedKey) {
      payload[trimmedKey] = item.value.trim()
    }
  })

  return {
    name: formData.name,
    schedule: generateCronExpression(formData),
    workflow_id: appId,
    payload,
    is_active: formData.status === 'active'
  }
}

// payload to localPayload
export const convertPayloadToLocalPayload = (payload: Record<string, any>): LocalPayloadItem[] => {
  return Object.entries(payload).map(([key, value]) => ({
    key,
    value: String(value)
  }))
}


export const getScheduleDescription = (schedule: string, t: (key: string, options?: any) => string): string => {
  switch (schedule) {
    case '* * * * *':
      return t('appCron.frequencies.everyMinute')
    case '0 * * * *':
      return t('appCron.frequencies.everyHour')
    default:
      // Every N minutes (*/5 * * * *)
      if (schedule.match(/^\*\/\d+ \* \* \* \*$/)) {
        const interval = schedule.split('/')[1].split(' ')[0]
        if (interval === '1') return t('appCron.frequencies.everyMinute')
        return t('appCron.frequencies.everyNMinutes', { interval })
      }
      
      // Every day at specific time (minute hour * * *)
      if (schedule.match(/^\d+ \d+ \* \* \*$/)) {
        return t('appCron.frequencies.everyDay')
      }
      
      // Weekly on specific day (minute hour * * day_of_week)
      if (schedule.match(/^\d+ \d+ \* \* \d$/)) {
        return t('appCron.frequencies.everyWeek')
      }
      
      // Monthly on specific day (minute hour day_of_month * *)
      if (schedule.match(/^\d+ \d+ \d+ \* \*$/)) {
        return t('appCron.frequencies.everyMonth')
      }
      
      // Yearly on specific day and month (minute hour day_of_month month *)
      if (schedule.match(/^\d+ \d+ \d+ \d+ \*$/)) {
        return t('appCron.frequencies.everyYear')
      }
      
      return schedule
  }
}
