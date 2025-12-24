'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RiMoreFill, RiEditLine, RiDeleteBinLine } from '@remixicon/react'
import Button from '@/app/components/base/button'
import Loading from '@/app/components/base/loading'
import StatusBadge from '@/app/components/base/status-badge'
import { useCronJobs } from '@/hooks/shai/use-cron-jobs'
import { useParams, useRouter } from 'next/navigation'
import { getScheduleDescription } from './utils/cronUtils'
import dayjs from 'dayjs'

type CronTableProps = {
  searchKeyword: string
}

const CronTable: React.FC<CronTableProps> = ({ searchKeyword }) => {
  const { t } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const appId = params.appId as string
  
  const { cronJobs, loading, error, deleteJob } = useCronJobs(appId)

  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })

  const handleEdit = (id: number) => {
    router.push(`/app/${appId}/cron/${id}`)
    setOpenMenuId(null)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteJob(id)
      setOpenMenuId(null)
    } catch (error) {
      console.error('Failed to delete cron job:', error)
    }
  }

  const handleMenuToggle = (id: number, event: React.MouseEvent) => {
    if (openMenuId === id) {
      setOpenMenuId(null)
    } else {
      const rect = event.currentTarget.getBoundingClientRect()
      setMenuPosition({ x: rect.right - 192, y: rect.bottom + 8 })
      setOpenMenuId(id)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !(event.target as Element).closest('.menu-container')) {
        setOpenMenuId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openMenuId])



  const filteredJobs = cronJobs.filter(job =>
    job.name.toLowerCase().includes(searchKeyword.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loading type="area" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="h-12 w-12 text-red-300 mx-auto mb-4 flex items-center justify-center">
          <RiMoreFill className="h-8 w-8" />
        </div>
        <p className="text-red-500">
          {t('appCron.table.loadingError')} {error}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="overflow-x-auto overflow-y-visible">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('appCron.table.name')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('appCron.table.frequency')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('appCron.table.executionTime')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('appCron.table.status')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('appCron.table.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredJobs.map(job => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-text-tertiary">
                    {job.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-tertiary">
                  {getScheduleDescription(job.schedule, t)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-tertiary">
                  {job.last_executed_at ? dayjs(job.last_executed_at.replace(/([+-]\d{2}:\d{2}|Z)/g, '')).format('YYYY-MM-DD HH:mm:ss') : t('appCron.table.neverExecuted')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge 
                    status={job.is_active ? 'active' : 'inactive'} 
                    label={job.is_active ? t('appCron.table.active') : t('appCron.table.inactive')}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium overflow-visible">
                  <div className="relative">
                    <Button
                      type="button"
                      variant="ghost"
                      className="p-1"
                      onClick={(e) => handleMenuToggle(job.id, e)}
                    >
                      <RiMoreFill className="h-4 w-4" />
                    </Button>
                    
                    {openMenuId === job.id && (
                      <div 
                        className="fixed w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 menu-container"
                        style={{ 
                          left: `${menuPosition.x}px`, 
                          top: `${menuPosition.y}px` 
                        }}
                      >
                        <div className="py-1">
                          <button
                            onClick={() => handleEdit(job.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-text-tertiary hover:bg-gray-100"
                          >
                            <RiEditLine className="h-4 w-4 mr-2" />
                            {t('appCron.table.edit')}
                          </button>
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <RiDeleteBinLine className="h-4 w-4 mr-2" />
                            {t('appCron.table.delete')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredJobs.length === 0 && (
        <div className="text-center py-8">
          <div className="h-12 w-12 text-gray-300 mx-auto mb-4 flex items-center justify-center">
            <RiMoreFill className="h-8 w-8" />
          </div>
          <p className="text-text-tertiary">
            {searchKeyword ? t('appCron.table.noJobsFound') : t('appCron.table.noJobs')}
          </p>
        </div>
      )}
    </div>
  )
}

export default CronTable
