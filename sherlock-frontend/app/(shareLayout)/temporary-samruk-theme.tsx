'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export const useSamrukTheme = () => {
  const pathname = usePathname()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (!hasMounted) return

    const isSamrukPath = [
      '/chat/MujaFYRon1KklStX',
      '/chat/G2SWojeJlGAsFkeg',
    ].includes(pathname)

    if (isSamrukPath) {
      document.documentElement.setAttribute('data-theme', 'samruk')
    }
  }, [hasMounted, pathname])
}
