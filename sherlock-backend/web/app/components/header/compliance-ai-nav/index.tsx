'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import {
  RiSearchEyeFill,
  RiSearchEyeLine,
} from '@remixicon/react'
import classNames from '@/utils/classnames'
import { useAppContext } from '@/context/app-context'

type ComplianceAINavProps = {
  className?: string
}

const ComplianceAINav = ({
  className,
}: ComplianceAINavProps) => {
  const { currentWorkspace } = useAppContext()
  const selectedSegment = useSelectedLayoutSegment()
  const activated = selectedSegment === 'compliance-ai' || selectedSegment === 'analysis'

  if (currentWorkspace?.compliance_ai_enabled !== true) {
    return null
  }

  return (
    <Link href="/compliance-ai/analysis" className={classNames(
      'group text-sm font-medium',
      activated && 'font-semibold bg-components-main-nav-nav-button-bg-active hover:bg-components-main-nav-nav-button-bg-active-hover shadow-md',
      activated ? 'text-components-main-nav-nav-button-text-active' : 'text-components-main-nav-nav-button-text hover:bg-components-main-nav-nav-button-bg-hover',
      className,
    )}>
      {
        activated
          ? <RiSearchEyeFill className='h-4 w-4' />
          : <RiSearchEyeLine className='h-4 w-4' />
      }
      <div className='ml-2 max-[1024px]:hidden'>
        ComplianceAgent
      </div>
    </Link>
  )
}

export default ComplianceAINav
