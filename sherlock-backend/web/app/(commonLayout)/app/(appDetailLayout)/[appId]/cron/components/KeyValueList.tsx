'use client'

import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { RiAddLine, RiDeleteBinLine } from '@remixicon/react'
import Input from '@/app/components/base/input'
import ActionButton from '@/app/components/base/action-button'
import Button from '@/app/components/base/button'
import type { LocalPayloadItem } from '../utils/cronUtils'

interface KeyValueListProps {
  value: LocalPayloadItem[]
  onChange: (value: LocalPayloadItem[]) => void
}

const KeyValueList: React.FC<KeyValueListProps> = ({ value, onChange }) => {
  const { t } = useTranslation()
  
  const addItem = useCallback(() => {
    onChange([...value, { key: '', value: '' }])
  }, [value, onChange])

  const removeItem = useCallback((index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }, [value, onChange])

  const updateItem = useCallback((index: number, field: 'key' | 'value', newValue: string) => {
    const newItems = value.map((item, i) => 
      i === index ? { ...item, [field]: newValue } : item
    )
    onChange(newItems)
  }, [value, onChange])

  return (
    <div className="space-y-3">
      {value.map((item, index) => (
        <div key={`kv-${index}`} className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              placeholder={t('appCron.form.key')}
              value={item.key}
              onChange={e => updateItem(index, 'key', e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Input
              placeholder={t('appCron.form.value')}
              value={item.value}
              onChange={e => updateItem(index, 'value', e.target.value)}
            />
          </div>
          <ActionButton 
            size="l" 
            className="group shrink-0 hover:!bg-state-destructive-hover" 
            onClick={() => removeItem(index)}
          >
            <RiDeleteBinLine className="h-4 w-4 text-text-tertiary group-hover:text-text-destructive" />
          </ActionButton>
        </div>
      ))}
      
      <Button
        type="button"
        variant="tertiary"
        size="small"
        onClick={addItem}
        className="flex items-center gap-2"
      >
        <RiAddLine className="h-4 w-4" />
        {t('appCron.form.add')}
      </Button>
    </div>
  )
}

export default React.memo(KeyValueList)
