'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '@/app/components/base/portal-to-follow-elem'
import { RiSearchLine, RiCloseLine } from '@remixicon/react'
import { useWorkspaceMembers } from '@/service/use-common'

export type MemberItem = { value: string | number; name: string }

type Props = {
  value?: string | number
  placeholder?: string
  className?: string
  onSelect: (item: MemberItem) => void
  disabled?: boolean
}

const MemberSelect: React.FC<Props> = ({ value, placeholder = 'Select user', className, onSelect, disabled }) => {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const triggerRef = React.useRef<HTMLDivElement>(null)
  const { data: workspaceMembers } = useWorkspaceMembers()
  const items = React.useMemo<MemberItem[]>(() => {
    const accounts = workspaceMembers?.accounts || []
    return accounts.map(acc => ({ value: acc.id, name: acc.name || acc.email }))
  }, [workspaceMembers])

  const selectedItem = items.find(i => i.value === value)
  const filtered = React.useMemo(() => {
    if (!searchQuery) return items
    return items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [items, searchQuery])

  return (
    <PortalToFollowElem
      open={open}
      onOpenChange={setOpen}
      placement="bottom-start"
      offset={4}
    >
      <PortalToFollowElemTrigger onClick={() => { if (!disabled) setOpen(v => !v) }} className="w-full">
        <div
          ref={triggerRef}
          className={`group flex h-9 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-2.5 text-sm hover:bg-gray-50 ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${className || ''}`}
          title={selectedItem?.name}
          aria-disabled={disabled}
        >
          {selectedItem ? (
            <span className="truncate flex-1">{selectedItem.name}</span>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
          {selectedItem ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onSelect({ value: 'system', name: 'system' })
              }}
              className="flex items-center justify-center w-5 h-5 rounded hover:bg-gray-200 ml-2 flex-shrink-0"
              disabled={disabled}
            >
              <RiCloseLine className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          ) : (
            <svg className="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent className="z-20">
        <div
          className="rounded-lg border border-gray-200 bg-white shadow-lg"
          style={{ width: triggerRef.current?.offsetWidth || 'auto', minWidth: '200px' }}
        >
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <RiCloseLine className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
          {/* Member List */}
          <div className="max-h-60 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map(item => (
                <div
                  key={item.value}
                  className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 ${value === item.value ? 'bg-blue-50' : ''}`}
                  onClick={() => {
                    onSelect(item)
                    setOpen(false)
                  }}
                >
                  <span className="truncate flex-1 text-sm max-w-[350px]">{item.name}</span>
                  {value === item.value && (
                    <svg className="w-4 h-4 text-blue-600 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-sm text-gray-500">
                {t('complianceAi.memberSelect.noUsersFound')}
              </div>
            )}
          </div>
        </div>
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  )
}

export default React.memo(MemberSelect)


