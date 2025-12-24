import { useState } from 'react'
import { assignSopGap } from '@/service/shai/compliance-reports'
import Toast from '@/app/components/base/toast'
import { useTranslation } from 'react-i18next'

export const useAssignGap = () => {
  const [isAssigning, setIsAssigning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  const assign = async (userId: string | number, sopSpecificGapId: string | number) => {
    try {
      setIsAssigning(true)
      setError(null)
      await assignSopGap(userId, sopSpecificGapId)
      Toast.notify({ type: 'success', message: t('complianceAi.reportView.assignedSuccess', { defaultValue: 'Assigned successfully' }) })
      return true
    } catch (e: any) {
      const msg = e?.message || t('complianceAi.reportView.assignedFailed', { defaultValue: 'Failed to assign' })
      setError(msg)
      Toast.notify({ type: 'error', message: msg })
      return false
    } finally {
      setIsAssigning(false)
    }
  }

  return {
    assign,
    isAssigning,
    error,
  }
}


