'use client'

import { useEffect } from 'react'
import { getValidTheme } from '@/utils/theme'
import { Theme } from '@/types/app'

const LayoutInitializer = () => {
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch('/console/api/system-features', {
          method: 'GET',
          cache: 'no-store',
        })

        if (!res.ok) throw new Error(`Request failed with status: ${res.status}`)

        const data = await res.json()

        const themeParam = data?.organization_name
        const theme = getValidTheme(themeParam) || Theme.light // Default theme = light

        document.documentElement.setAttribute('data-theme', theme)
      } catch (error) {
        console.error('[Layout Initializer] Error applying theme:', error)
        document.documentElement.setAttribute('data-theme', Theme.light) // Default theme = light
      }
    }

    init()
  }, [])

  return null
}

export default LayoutInitializer
