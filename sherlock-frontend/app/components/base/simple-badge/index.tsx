import type { CSSProperties, ReactNode } from 'react'
import cn from '@/utils/classnames'

type SimpleBadgeProps = {
  children?: ReactNode
  text?: ReactNode
  className?: string
  style?: CSSProperties
}

const SimpleBadge = ({ children, text, className, style }: SimpleBadgeProps) => {
  return (
    <span
      style={style}
      className={cn(
        'inline-flex items-center rounded-[8px] border px-2 py-0.5 text-[12px]',
        'border-[#E4E4E2] bg-background-default text-text-tertiary',
        className,
      )}
    >
      {children ?? text}
    </span>
  )
}

export default SimpleBadge
