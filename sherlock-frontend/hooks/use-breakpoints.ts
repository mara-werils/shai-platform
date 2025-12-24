'use client'
import { useState, useEffect, useMemo } from 'react'

export enum MediaType {
  mobile = 'mobile',
  tablet = 'tablet',
  pc = 'pc',
}

const getMediaType = (width: number) => {
  if (width <= 640) return MediaType.mobile
  if (width <= 768) return MediaType.tablet
  return MediaType.pc
}

const useBreakpoints = () => {
  const [width, setWidth] = useState<number | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const media = useMemo(() => {
    if (width === null) {
      return MediaType.pc
    }
    return getMediaType(width)
  }, [width])

  return media
}

export default useBreakpoints
