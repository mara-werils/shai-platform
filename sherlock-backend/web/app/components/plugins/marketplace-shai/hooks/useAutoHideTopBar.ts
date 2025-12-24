'use client'

import { useEffect, useRef, useState } from 'react'

export const useAutoHideTopBar = (options?: {
  scrollContainerId?: string
  deltaThreshold?: number
  thresholdOffsetPx?: number
}) => {
  const { scrollContainerId, deltaThreshold = 8, thresholdOffsetPx = 0 } = options || {}

  const topBarRef = useRef<HTMLDivElement | null>(null)
  const [topBarHeight, setTopBarHeight] = useState(0)
  const [hide, setHide] = useState(false)
  const lastYRef = useRef(0)

  // measure top bar height
  useEffect(() => {
    const measure = () => {
      const h = topBarRef.current?.offsetHeight || 0
      setTopBarHeight(h)
    }
    measure()
    const RO = (window as any).ResizeObserver
    const ro = RO ? new RO(measure) : null
    if (ro && topBarRef.current)
      ro.observe(topBarRef.current)
    window.addEventListener('resize', measure)
    return () => {
      if (ro) ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  // scroll handler (container or window)
  useEffect(() => {
    const container = scrollContainerId ? document.getElementById(scrollContainerId) : null
    const getScrollTop = () => container ? container.scrollTop : (window.scrollY || 0)
    lastYRef.current = getScrollTop()
    let ticking = false

    const onScroll = () => {
      const currentY = getScrollTop()
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const delta = currentY - lastYRef.current
          if (Math.abs(delta) > deltaThreshold) {
            const threshold = topBarHeight + thresholdOffsetPx
            if (currentY <= 0 || currentY < threshold)
              setHide(false)
            else
              setHide(delta > 0) // down -> hide, up -> show
            lastYRef.current = currentY
          }
          ticking = false
        })
        ticking = true
      }
    }

    const target: any = container || window
    target.addEventListener('scroll', onScroll, { passive: true })
    return () => target.removeEventListener('scroll', onScroll)
  }, [scrollContainerId, topBarHeight, deltaThreshold, thresholdOffsetPx])

  return { topBarRef, hide }
}
