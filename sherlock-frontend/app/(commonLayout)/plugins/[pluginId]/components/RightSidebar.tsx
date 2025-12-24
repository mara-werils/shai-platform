'use client'

import SimpleBadge from '@/app/components/base/simple-badge'
import { RiBrain2Line, RiHammerLine, RiPuzzle2Line, RiSpeakAiLine } from '@remixicon/react'
import { useTranslation } from 'react-i18next'
import React, { useMemo } from 'react'

type Props = {
  category?: 'model' | 'tool' | 'agent-strategy' | 'extension' | 'bundle' | string
  version?: string
  versionDate?: string
  organization?: string
  versions?: Array<{ version: string; created_at: string }>
  onOpenVersionHistory?: () => void
}

const RightSidebar = ({ category, version, versionDate, organization, versions = [], onOpenVersionHistory }: Props) => {
  const { t } = useTranslation()

  const icon = useMemo(() => {
    switch (category) {
      case 'tool':
        return <RiHammerLine className='mr-1.5 h-5 w-5' />
      case 'agent-strategy':
        return <RiSpeakAiLine className='mr-1.5 h-5 w-5' />
      case 'extension':
      case 'bundle':
        return <RiPuzzle2Line className='mr-1.5 h-5 w-5' />
      case 'model':
      default:
        return <RiBrain2Line className='mr-1.5 h-5 w-5' />
    }
  }, [category])

  const categoryLabel = useMemo(() => {
    switch (category) {
      case 'tool':
        return t('plugin.categorySingle.tool')
      case 'agent-strategy':
        return t('plugin.categorySingle.agent')
      case 'extension':
        return t('plugin.categorySingle.extension')
      case 'model':
      default:
        return t('plugin.categorySingle.model')
    }
  }, [category, t])

  const versionDateText = useMemo(() => (versionDate ? new Date(versionDate).toLocaleString() : ''), [versionDate])
  const versionsCount = useMemo(() => versions?.length || 0, [versions])
  const organizationText = organization || ''

  return (
    <aside className='min-h-full w-auto min-w-[300px] shrink-0 space-y-4 bg-background-neutral-subtle'>
      <div>
        <div className='mb-1 text-[18px] font-medium text-util-colors-gray-gray-600'>{t('plugin.detail.sidebar.category')}</div>
        <SimpleBadge className='px-4 text-[16px]'>
          {icon}
          <span>{categoryLabel}</span>
        </SimpleBadge>
      </div>

      <div>
        <div className='mb-1 text-[18px] font-medium text-util-colors-gray-gray-600'>{t('plugin.detail.sidebar.version')}</div>
        <SimpleBadge className='px-4 text-[16px] font-medium'>
          <span>{version || '-'}</span>
          {(organizationText || versionDateText) && (
            <span className='mx-2 inline-block h-4 w-px bg-[#E4E4E2]'></span>
          )}
          {organizationText && (
            <span className='text-[14px] font-light'>{organizationText}</span>
          )}
          {organizationText && versionDateText && (
            <span className='mx-2 text-[14px] font-light'>·</span>
          )}
          {versionDateText && (
            <span className='text-[14px] font-light'>{versionDateText}</span>
          )}
        </SimpleBadge>
        {
          versionsCount > 1 && (<button
            className='mt-2 block text-[14px] font-semibold text-text-accent disabled:text-text-quaternary'
            disabled={versionsCount <= 1}
            onClick={onOpenVersionHistory}
          >
            {t('plugin.detail.sidebar.versionHistory')}
          </button>)
        }
      </div>
      {/* TODO: добавить requirements когда они появятся на бекенде */}
      {/* <div>
        <div className='mb-2 text-[18px] font-medium text-util-colors-gray-gray-600'>{t('plugin.detail.sidebar.requirements')}</div>
        <div className='space-y-2 rounded-2xl border border-[#E4E4E2] bg-components-panel-on-panel-item-bg p-4 text-[16px] font-medium text-text-terтиary'>
          <div>LLM invocation</div>
          <div>Tool invocation</div>
          <div className='flex items-center gap-1'>
            Maximum memory
            <SimpleBadge className='text-util-colors-gray-gray-60 text-[13px] font-light'>256 MB</SimpleBadge>
          </div>
        </div>
      </div> */}
    </aside>
  )
}

export default React.memo(RightSidebar)
