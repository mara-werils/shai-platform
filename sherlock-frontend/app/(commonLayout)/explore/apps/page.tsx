'use client'

import React from 'react'
import AppList from '@/app/components/explore/app-list'
import useMainUserCheck from '@/hooks/use-main-user-check'

const Apps = () => {
  const { isMainUser } = useMainUserCheck()

  if (!isMainUser) return null
  return <AppList />
}

export default React.memo(Apps)
