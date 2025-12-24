'use client'

import { useEffect, useMemo } from 'react'
import { useAppContext } from '@/context/app-context'
import { getValidTheme } from '@/utils/theme'

const ThemeChecker = () => {
  const { userProfile } = useAppContext()

  const theme = useMemo(() => {
    if (userProfile && userProfile.interface_theme && userProfile.interface_theme !== 'light') {
      return getValidTheme(userProfile.interface_theme)
    }
    return undefined
  }, [userProfile])

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme])

  return null
}

export default ThemeChecker
