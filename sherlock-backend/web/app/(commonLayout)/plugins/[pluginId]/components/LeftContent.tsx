'use client'

import { Markdown } from '@/app/components/base/markdown'
import React, { useMemo } from 'react'

const LeftContent = ({ content }: { content: string }) => {
  const overrides = useMemo(() => ({
    h1: ({ children }: any) => <h2 className='mb-2 !text-[20px] !font-medium !leading-6 text-util-colors-gray-gray-600'>{children}</h2>,
    h2: ({ children }: any) => <h2 className='mb-2 !text-[20px] !font-medium !leading-6 text-util-colors-gray-gray-600'>{children}</h2>,
    h3: ({ children }: any) => <h2 className='mb-2 !text-[20px] !font-medium !leading-6 text-util-colors-gray-gray-600'>{children}</h2>,
    h4: ({ children }: any) => <h2 className='mb-2 !text-[20px] !font-medium !leading-6 text-util-colors-gray-gray-600'>{children}</h2>,
    h5: ({ children }: any) => <h2 className='mb-2 !text-[20px] !font-medium !leading-6 text-util-colors-gray-gray-600'>{children}</h2>,
    h6: ({ children }: any) => <h2 className='mb-2 !text-[20px] !font-medium !leading-6 text-util-colors-gray-gray-600'>{children}</h2>,
    // Используем div вместо p, чтобы избежать вложенных блоков внутри p
    p: ({ children }: any) => <div className='!text-[14px] !font-light !leading-[1.2] text-util-colors-gray-gray-600'>{children}</div>,
    li: ({ children }: any) => <li className='!text-[14px] !font-light !leading-[1.2] text-util-colors-gray-gray-600'>{children}</li>,
    strong: ({ children }: any) => <strong className='!font-semibold'>{children}</strong>,
    b: ({ children }: any) => <strong className='!font-semibold'>{children}</strong>,
  }), [])
  return (
    <div className='min-h-full flex-1 bg-background-neutral-subtle p-0'>
      <section className='mb-8'>
        <div className='max-w-none pr-20'>
          <Markdown
            content={content}
            componentsOverrides={overrides}
          />
        </div>

      </section>
    </div>
  )
}

export default React.memo(LeftContent)
