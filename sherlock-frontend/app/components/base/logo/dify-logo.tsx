'use client'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { basePath } from '@/utils/var'
import classNames from '@/utils/classnames'
import { getValidTheme } from '@/utils/theme'

export type LogoSize = 'large' | 'medium' | 'small'

export const logoSizeMap: Record<LogoSize, string> = {
  large: 'w-16',
  medium: 'w-12 h-[2rem]',
  small: 'w-9 h-4',
}

type DifyLogoProps = {
  size?: LogoSize
  className?: string
}

const DifyLogo: FC<DifyLogoProps> = ({
  size = 'medium',
  className,
}) => {
  const [theme, setTheme] = useState<string>('default')

  useEffect(() => {
    const updateTheme = () => {
      const htmlTheme = document.documentElement.getAttribute('data-theme')
      const validTheme = getValidTheme(htmlTheme)
      setTheme(validTheme || 'default')
    }

    updateTheme()

    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => observer.disconnect()
  }, [])

  const logoSrc = theme === 'default'
    ? `${basePath}/logo/logo.svg`
    : `${basePath}/logo-other/${theme}.svg`

  return (
    <img
      src={logoSrc}
      className={classNames('block object-contain', logoSizeMap[size], className)}
      alt='Shai logo'
      style={{ maxHeight: '56px' }}
    />
  )
}

export default DifyLogo
