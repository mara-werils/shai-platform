'use client'

import React from 'react'
import Card from './card'
import Loading from '@/app/components/base/loading'
import type { MarketItem } from '@/types/marketplace-shai'

const Grid = ({ items, loading, onInstallSuccess }: {
  items: MarketItem[]
  loading: boolean
  onInstallSuccess?: (item: MarketItem) => void
}) => {
  let content = null
  if (items.length === 0) {
    content = (
      <div className='flex min-h-[200px] grow items-center justify-center text-text-tertiary'>
        {loading ? <Loading /> : 'Ничего не найдено'}
      </div>
    )
  }
  else {
    content = (
      <>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
          {items.map(i => (
            <Card key={i.id} item={i} onInstallSuccess={onInstallSuccess} />
          ))}
        </div>
      </>
    )
  }

  return (
    <div className='flex grow flex-col bg-background-default-subtle px-6 pb-3 pt-6 md:px-8 xl:px-10'>
      {content}
    </div>
  )
}

export default React.memo(Grid)
