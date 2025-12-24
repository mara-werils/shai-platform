'use client'
import { useTranslation } from 'react-i18next'
import cn from '@/utils/classnames'

type LoginStatusBadgeProps = {
  status: 'success' | 'error'
  className?: string
}

const LoginStatusBadge = ({ status, className = '' }: LoginStatusBadgeProps) => {
  const { t } = useTranslation()
  const isSuccess = status === 'success'

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div
        className={cn(
          'h-[10px] w-[10px] rounded border',
          isSuccess ? 'bg-[#49CC88] border-[#079455]' : 'bg-[#FFA3A3] border-[#FF5D5D]',
        )}
      />
      <span className={cn(
        'system-sm-regular',
        isSuccess ? 'text-[#079455]' : 'text-[#FF5D5D]',
      )}>
        {isSuccess ? t('common.members.loginSuccess') : t('common.members.loginError')}
      </span>
    </div>
  )
}

export default LoginStatusBadge

