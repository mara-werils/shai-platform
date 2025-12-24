'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Apps from '@/app/components/apps'
import Loading from '@/app/components/base/loading'
import { useCheckRoleAccess } from '@/hooks/shai/use-check-role-access'

const AppList = () => {
  const router = useRouter()
  const { checkRoleAccess, isLoading } = useCheckRoleAccess()
  const hasAccess = checkRoleAccess(['owner', 'admin', 'editor'])

  useEffect(() => {
    if (!isLoading && !hasAccess)
      router.replace('/explore/apps')
  }, [isLoading, hasAccess, router])

  if (isLoading || !hasAccess)
    return <Loading type='app' />

  return (
    <Apps />
  )
}

export default AppList
