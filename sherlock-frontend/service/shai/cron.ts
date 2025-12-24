import Toast from '@/app/components/base/toast'
import {
  createApikey as createAppApikey,
  fetchApiKeysList as fetchAppApiKeysList,
} from '@/service/apps'

const CRON_API_BASE_URL = 'https://services.shai.pro/cron'

const makeRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    mode: 'cors',
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const text = await response.text()
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch (error) {
    return text
  }
}

export type CronJob = {
  id: number
  name: string
  schedule: string
  workflow_id: string
  payload: Record<string, any>
  is_active: boolean
  created_at: string
  updated_at: string
  last_executed_at: string | null
}

const getOrCreateApiKey = async (appId: string): Promise<string> => {
  try {
    const apiKeysResponse = await fetchAppApiKeysList({
      url: `/apps/${appId}/api-keys`,
      params: {},
    })

    if (apiKeysResponse.data && apiKeysResponse.data.length > 0)
      return apiKeysResponse.data[0].token

    const newApiKey = await createAppApikey({
      url: `/apps/${appId}/api-keys`,
      body: {},
    })

    return newApiKey.token
  } catch (error) {
    throw new Error('Не удалось получить API ключ для приложения')
  }
}

export const fetchCronJobs = async (appId: string): Promise<CronJob[]> => {
  try {
    const data = await makeRequest(`${CRON_API_BASE_URL}/jobs/by_workflow/${appId}`)

    if (data.length > 0) {
      Toast.notify({
        type: 'success',
        message: `Загружено ${data.length} cron заданий`,
      })
    }

    return data as CronJob[]
  } catch (error) {
    Toast.notify({
      type: 'error',
      message: 'Не удалось загрузить cron задания',
    })
    throw error
  }
}

export const createCronJob = async (appId: string, cronJob: Omit<CronJob, 'id' | 'created_at' | 'updated_at' | 'last_executed_at'>): Promise<CronJob> => {
  try {
    const apiToken = await getOrCreateApiKey(appId)

    const cronJobWithToken = {
      ...cronJob,
      token: apiToken,
      workflow_type: 'WORKFLOW',
    }

    const data = await makeRequest(`${CRON_API_BASE_URL}/jobs/`, {
      method: 'POST',
      body: JSON.stringify(cronJobWithToken),
    })

    Toast.notify({
      type: 'success',
      message: 'Cron задание успешно создано',
    })

    return data as CronJob
  } catch (error) {
    Toast.notify({
      type: 'error',
      message: 'Не удалось создать cron задание',
    })
    throw error
  }
}

export const updateCronJob = async (appId: string, id: number, cronJob: Partial<CronJob>): Promise<CronJob> => {
  try {
    const data = await makeRequest(`${CRON_API_BASE_URL}/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cronJob),
    })

    Toast.notify({
      type: 'success',
      message: 'Cron задание успешно обновлено',
    })

    return data as CronJob
  } catch (error) {
    Toast.notify({
      type: 'error',
      message: 'Не удалось обновить cron задание',
    })
    throw error
  }
}

export const deleteCronJob = async (appId: string, id: number): Promise<boolean> => {
  try {
    await makeRequest(`${CRON_API_BASE_URL}/jobs/${id}`, {
      method: 'DELETE',
    })

    Toast.notify({
      type: 'success',
      message: 'Cron задание успешно удалено',
    })

    return true
  } catch (error) {
    Toast.notify({
      type: 'error',
      message: 'Не удалось удалить cron задание',
    })
    throw error
  }
}

export const fetchCronJob = async (appId: string, id: number): Promise<CronJob | null> => {
  try {
    const data = await makeRequest(`${CRON_API_BASE_URL}/jobs/${id}`)
    return data as CronJob
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return null
    }
    
    Toast.notify({
      type: 'error',
      message: 'Не удалось загрузить cron задание',
    })
    throw error
  }
}