import type { FC } from 'react'
import { useRef, useState } from 'react'
import { RiCloseLine } from '@remixicon/react'
import ActionButton from '@/app/components/base/action-button'
import cn from '@/utils/classnames'

type Size = 'small' | 'large'

type StylizedInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  size?: Size
  inputClassName?: string
  className?: string
  autoFocus?: boolean
}

// Универсальный стилизованный инпут (как SearchBox без тегов)
const StylizedInput: FC<StylizedInputProps> = ({
  value,
  onChange,
  placeholder = '',
  size = 'small',
  inputClassName,
  className,
  autoFocus,
}) => {
  const isComposing = useRef(false)
  const [internal, setInternal] = useState(value)

  // синхронизируемся наружу только вне композиции IME
  const emit = (v: string) => {
    setInternal(v)
    if (!isComposing.current) onChange(v)
  }

  return (
    <div
      className={cn(
        'z-[11] flex items-center',
        size === 'large'
          ? 'rounded-xl border border-components-chat-input-border bg-components-panel-bg-blur p-1.5 shadow-md'
          : 'rounded-lg bg-components-input-bg-normal p-0.5',
        className,
      )}
    >
      <div className='relative flex grow items-center p-1 pl-2'>
        <div className='mr-2 flex w-full items-center'>
          <input
            autoFocus={autoFocus}
            className={cn(
              'body-md-medium block grow appearance-none bg-transparent text-text-secondary outline-none',
              inputClassName,
            )}
            value={internal}
            onChange={e => emit(e.target.value)}
            onCompositionStart={() => {
              isComposing.current = true
            }}
            onCompositionEnd={(e) => {
              isComposing.current = false
              onChange((e.currentTarget as HTMLInputElement).value)
            }}
            placeholder={placeholder}
          />
          {internal && (
            <div className='absolute right-2 top-1/2 -translate-y-1/2'>
              <ActionButton onClick={() => emit('')}>
                <RiCloseLine className='h-4 w-4' />
              </ActionButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StylizedInput
