'use client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import cn from '@/utils/classnames'

type MemberStatusBadgeProps = {
  status: 'active' | 'banned' | 'inactive'
  className?: string
}

const MemberStatusBadge: React.FC<MemberStatusBadgeProps> = ({ status, className = '' }) => {
  const { t } = useTranslation()
  const isActive = status === 'active'
  const isBanned = status === 'banned'

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div
        className={cn(
          'h-[10px] w-[10px] rounded border',
          isActive ? 'bg-[#49CC88] border-[#079455]' : isBanned ? 'bg-[#F56565] border-[#DC2626]' : 'bg-[#F3F5F8] border-[#DBDCDF]',
        )}
      />
      <span className={cn(
        'system-sm-regular',
        isActive ? 'text-[#079455]' : isBanned ? 'text-[#DC2626]' : 'text-[#495464]',
      )}>
        {isActive ? t('common.members.active') : isBanned ? t('common.members.banned') : t('common.members.inactive')}
      </span>
    </div>
  )
}

export default MemberStatusBadge

