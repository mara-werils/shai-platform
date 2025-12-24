'use client'

import Button from '@/app/components/base/button'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import type { MarketItem } from '@/types/marketplace-shai'

const Card = ({ item, onInstallSuccess }: { item: MarketItem, onInstallSuccess?: (item: MarketItem) => void }) => {
  const { t } = useTranslation()
  return (
    <div className='relative flex h-[214px] w-full flex-col rounded-[16px] border border-[#E4E4E2] bg-components-panel-on-panel-item-bg px-5 py-6'>
      {/* badge в правом верхнем углу */}
      <div className='absolute right-0 top-0 flex h-[26px] items-center justify-center rounded-bl-[8px] rounded-tr-[16px] bg-third-party-model-bg-default px-3 text-[12px] uppercase'>
        {(() => {
          const raw = item.category || item.type || ''
          const norm = raw === 'agent-strategy' ? 'agent' : raw
          if (norm === 'model' || norm === 'tool' || norm === 'extension' || norm === 'bundle' || norm === 'agent')
            return t(`plugin.categorySingle.${norm}`)
          return (raw || '').toUpperCase().replace('-', ' ')
        })()}
      </div>
      {/* заголовок и иконка */}
      <div className='flex items-start gap-5 pr-20'>
        <div className='flex h-12 w-12 items-center justify-center overflow-hidden rounded-[12px]'>
          {item.icon ? (
            <img
              src={item.icon}
              alt=""
              loading='lazy'
              className='h-full w-full object-contain'
            />
          ) : null}
        </div>
        <div className='line-clamp-1 text-[16px] font-medium text-util-colors-gray-gray-600'>
          {item.title || ''}
        </div>
      </div>

      {/* описание */}
      <div className='flex grow items-center'>
        <p className='line-clamp-2 text-[14px] font-light leading-[1.2] text-util-colors-gray-gray-600'>
          {item.description || ''}
        </p>
      </div>

      {/* действия */}
      <div className='mt-auto flex items-center justify-between'>
        <div className='flex items-center gap-1 text-util-colors-gray-gray-600'>
          {/* <RiInstallLine className='h-4 w-4 shrink-0' />
          <span className='text-[13px] font-light'>{item.installs ?? 0}</span> */}
        </div>
        <div className='flex gap-3'>
          <Link href={`/plugins/${encodeURIComponent(item.id)}`}>
          <Button
              variant='secondary'
              className='h-9 w-[99px] justify-center rounded-[8px] text-[14px] font-normal leading-[18px]'
            >
              {t('plugin.detailPanel.operation.viewDetail')}
            </Button>
          </Link>
          <Button
            variant='primary'
            className='h-9 w-[99px] justify-center rounded-[8px] text-[14px] font-normal leading-[18px]'
            onClick={() => onInstallSuccess?.(item)}
          >
            {t('plugin.installAction')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Card)
