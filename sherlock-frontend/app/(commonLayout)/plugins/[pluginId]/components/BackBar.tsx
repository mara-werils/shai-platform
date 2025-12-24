'use client'

import { useRouter } from 'next/navigation'
import { RiArrowLeftLine } from '@remixicon/react'

const BackBar = () => {
  const router = useRouter()
  return (
    <div className='flex h-[60px] items-center border-b border-divider-subtle bg-background-default'>
      <button
        type='button'
        aria-label='Back'
        onClick={() => router.back()}
        className='flex items-center pl-[24px] text-text-secondary hover:text-text-primary'
      >
        <RiArrowLeftLine className='h-5 w-5' />
      </button>
    </div>
  )
}

export default BackBar
