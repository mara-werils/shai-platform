'use client'
import type { FC } from 'react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ToolProviderList from '@/app/components/tools/provider-list'
import Loading from '@/app/components/base/loading'
import { useCheckRoleAccess } from '@/hooks/shai/use-check-role-access'

import useDocumentTitle from '@/hooks/use-document-title'
const ToolsList: FC = () => {
  const router = useRouter()
  const { checkRoleAccess, isLoading } = useCheckRoleAccess()
  const { t } = useTranslation()
  useDocumentTitle(t('common.menus.tools'))

  const hasAccess = checkRoleAccess(['owner', 'admin', 'editor'])

  useEffect(() => {
    if (!isLoading && !hasAccess)
      router.replace('/explore/apps')
  }, [isLoading, hasAccess, router])

  if (isLoading || !hasAccess)
    return <Loading type='app' />

  return <ToolProviderList />
}
export default React.memo(ToolsList)
