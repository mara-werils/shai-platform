'use client'

import Button from '@/app/components/base/button'
import SimpleBadge from '@/app/components/base/simple-badge'
import { useTranslation } from 'react-i18next'
import React from 'react'
import PluginInstalledModal from '@/app/components/plugins/marketplace-shai/components/PluginInstalledModal'

type Props = {
  name: string
  version: string
  icon?: string
  uniqueIdentifier?: string
  org?: string
  category?: string
  brief?: string
  pluginId: string
}

const PluginPageHeader = ({ name, version, icon, brief, uniqueIdentifier, pluginId }: Props) => {
  const { t } = useTranslation()
  const [installedData, setInstalledData] = React.useState<
    null | { name: string; version: string; typeLabel?: string; description?: string; icon?: string; uniqueIdentifier?: string; pluginId?: string }
  >(null)
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-3'>
        <div className='flex h-20 w-20 items-center justify-center overflow-hidden rounded-[16px] border border-divider-subtle bg-components-panel-on-panel-item-bg'>
          {icon ? (
            <img src={icon} alt='' loading='lazy' className='h-[90%] w-[90%] object-contain' />
          ) : (
            <span className='text-[18px] text-text-quaternary'>🤖</span>
          )}
        </div>
        <div className='flex items-center gap-2'>
          <h1 className='text-[24px] font-semibold leading-7 text-text-primary'>{name}</h1>
          <SimpleBadge className='text-util-colors-gray-gray-600'>{version}</SimpleBadge>
        </div>
      </div>
      <Button
        variant='primary'
        className='h-10 min-w-[110px] justify-center gap-1 rounded-[8px] pl-4 pr-3 text-[14px] leading-[18px]'
        onClick={() => setInstalledData({ name, version, typeLabel: 'ИНСТРУМЕНТ', description: brief || '', icon, uniqueIdentifier, pluginId })}
      >
        {t('plugin.installAction')}
        <svg width="12" height="16" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg" className='ml-2'>
          <path d="M1 17H13M7 1V13M7 13L10.5 9.5M7 13L3.5 9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Button>
      <PluginInstalledModal
        isShow={!!installedData}
        onClose={() => setInstalledData(null)}
        data={installedData ?? { name: '', version: '', typeLabel: '', description: '', icon: '', pluginId: pluginId || '', uniqueIdentifier: uniqueIdentifier || '' }}
      />
    </div>
  )
}

export default React.memo(PluginPageHeader)
