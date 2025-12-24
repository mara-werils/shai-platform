'use client'

import TabSliderNew from '@/app/components/base/tab-slider-new'
import { useTranslation } from 'react-i18next'
import React, { useMemo } from 'react'
import {
  RiBrain2Line,
  RiHammerLine,
  RiPuzzle2Line,
  RiSpeakAiLine,
} from '@remixicon/react'
import InputStyled from '@/app/components/base/input-styled'

import type { Tab } from '@/types/marketplace-shai'

type TopBarProps = {
  tab: Tab
  query: string
  onTabChange: (t: string) => void
  onSearchChange: (q: string) => void
}

const TopBar = ({ tab, query, onTabChange, onSearchChange }: TopBarProps) => {
  const { t } = useTranslation()
  const tabOptions: Array<{ value: Tab, text: string, icon?: React.ReactNode }> = useMemo(() => ([
    { value: 'all', text: t('plugin.category.all'), icon: null },
    { value: 'model', text: t('plugin.category.models'), icon: <RiBrain2Line className='mr-1.5 h-4 w-4' /> },
    { value: 'tool', text: t('plugin.category.tools'), icon: <RiHammerLine className='mr-1.5 h-4 w-4' /> },
    { value: 'agent-strategy', text: t('plugin.category.agents'), icon: <RiSpeakAiLine className='mr-1.5 h-4 w-4' /> },
    { value: 'extension', text: t('plugin.category.extensions'), icon: <RiPuzzle2Line className='mr-1.5 h-4 w-4' /> },
  ]), [t])
  return (
    <div className='flex flex-col items-center gap-3 bg-background-body px-12 pb-4 pt-6'>
      <div className='text-center'>
        <h1 className='text-[28px] font-semibold leading-8 text-text-primary'>{t('plugin.marketplace.empower')}</h1>
        <p className='mx-auto mt-3 max-w-[630px] leading-[1.2] text-text-tertiary'>
          {t('plugin.marketplace.tagline')}
        </p>
      </div>
      <InputStyled
        value={query}
        onValueChange={onSearchChange}
        placeholder={t('plugin.searchInMarketplace')}
        className='mt-3 w-[640px]'
      />
      <div className='flex w-full items-center justify-center'>
        <TabSliderNew
          value={tab}
          onChange={v => onTabChange(v as Tab)}
          options={tabOptions}
          itemClassName='text-base'
        />
      </div>
    </div>
  )
}

export default React.memo(TopBar)
