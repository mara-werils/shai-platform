import { type FC, useMemo } from 'react'
import { RiArrowLeftLine } from '@remixicon/react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Stepper, type StepperProps } from '@/app/components/datasets/create/stepper'
import classNames from '@/utils/classnames'

export type TopBarProps = Pick<StepperProps, 'activeIndex'> & {
  className?: string
}

const STEP_T_MAP: Record<number, string> = {
  1: 'complianceAi.newAnalysisPage.step1.title',
  2: 'complianceAi.newAnalysisPage.step2.title',
  3: 'complianceAi.newAnalysisPage.step3.title',
}

export const TopBar: FC<TopBarProps> = (props) => {
  const { className, ...rest } = props
  const { t } = useTranslation()

  const fallbackRoute = useMemo(() => {
    return '/compliance-ai/analysis'
  }, [])

  return (
    <div className={classNames('flex shrink-0 h-[52px] items-center justify-between relative border-b border-b-divider-subtle', className)}>
      <Link href={fallbackRoute} replace className="inline-flex h-12 items-center justify-start gap-1 py-2 pl-2 pr-6">
        <div className='p-2'>
          <RiArrowLeftLine className='size-4 text-text-primary' />
        </div>
        <p className="system-sm-semibold-uppercase text-text-primary">
          {t('complianceAi.newAnalysisPage.title')}
        </p>
      </Link>
      <div className={
        'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
      }>
        <Stepper
          steps={Array.from({ length: 3 }, (_, i) => ({
            name: t(STEP_T_MAP[i + 1]),
          }))}
          {...rest}
        />
      </div>
    </div>
  )
}
