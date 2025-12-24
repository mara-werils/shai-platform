import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, ForwardedRef, InputHTMLAttributes } from 'react'
import cn from '@/utils/classnames'

export type BaseInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'> & {
  value?: string | number
  defaultValue?: string | number
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onValueChange?: (value: string) => void
}

function useIme(onFinalize: (v: string) => void) {
  const isComposing = useRef(false)
  const onCompositionStart = () => {
    isComposing.current = true
  }
  const onCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposing.current = false
    onFinalize(e.currentTarget.value)
  }
  return { isComposing, onCompositionStart, onCompositionEnd }
}

const InputStyled = ({
  value,
  defaultValue,
  onChange,
  onValueChange,
  placeholder,
  className,
  ...rest
}: BaseInputProps, ref: ForwardedRef<HTMLInputElement>) => {
  const controlled = value !== undefined
  const initial = useMemo(() => (controlled ? String(value ?? '') : String(defaultValue ?? '')), [controlled, value, defaultValue])
  const [internal, setInternal] = useState<string>(initial)
  const current = controlled ? String(value ?? '') : internal

  const { isComposing, onCompositionStart, onCompositionEnd } = useIme(v => onValueChange?.(v))

  useEffect(() => {
    if (controlled && current !== internal)
      setInternal(current)
  }, [controlled, current, internal])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    if (!controlled) setInternal(v)
    if (!isComposing.current) onValueChange?.(v)
    onChange?.(e)
  }

  return (
    <input
      ref={ref}
      className={cn(
        'w-full appearance-none bg-white text-text-secondary outline-none placeholder:text-[#A7AFBE]',
        'rounded-[8px] border border-[#E7E8EA] shadow-[0_6px_24px_rgba(0,0,0,0.03)]',
        'px-3 py-2',
        className,
      )}
      value={current}
      onChange={handleChange}
      onCompositionStart={onCompositionStart}
      onCompositionEnd={onCompositionEnd}
      aria-label={rest['aria-label'] || placeholder || 'input'}
      placeholder={placeholder}
      {...rest}
    />
  )
}

export default forwardRef(InputStyled)
