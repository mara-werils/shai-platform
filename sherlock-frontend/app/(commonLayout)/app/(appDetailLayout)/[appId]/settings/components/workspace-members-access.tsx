'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import Checkbox from '@/app/components/base/checkbox'
import Button from '@/app/components/base/button'
import SearchInput from '@/app/components/base/search-input'
import { useWorkspaceMembers } from '@/service/use-common'
import { useAppMembers, useUpdateAppMembers } from '@/service/use-apps'
import { useToastContext } from '@/app/components/base/toast'

type Props = {
  appId: string
}

const WorkspaceMembersAccess: React.FC<Props> = ({ appId }) => {
  const { t } = useTranslation()
  const { notify } = useToastContext()
  const { data: workspaceMembers } = useWorkspaceMembers()
  const availableMembers = (workspaceMembers?.accounts || []).map(a => ({ id: `${a.id}`, name: a.name, email: a.email }))

  const [savedSelectedMemberIds, setSavedSelectedMemberIds] = React.useState<string[]>([])
  const [selectedMemberIds, setSelectedMemberIds] = React.useState<string[]>([])
  const [isEditing, setIsEditing] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const { mutateAsync: updateAppMembers, isPending: isSaving } = useUpdateAppMembers()
  const { data: appMembersData } = useAppMembers(appId)

  React.useEffect(() => {
    // Инициализируем сохранённые выбранные пользователи из текущих настроек приложения
    const accounts = (appMembersData as any)?.accounts
    if (Array.isArray(accounts)) {
      const ids = accounts.map((a: any) => `${a.id ?? a.account_id ?? a}`)
      setSavedSelectedMemberIds(ids)
    }
  }, [appMembersData])

  const toggleMember = React.useCallback((id: string) => {
    setSelectedMemberIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }, [])

  const handleStartEdit = React.useCallback(() => {
    setSelectedMemberIds(savedSelectedMemberIds)
    setSearch('')
    setIsEditing(true)
  }, [savedSelectedMemberIds])

  const handleCancelEdit = React.useCallback(() => {
    setSelectedMemberIds(savedSelectedMemberIds)
    setSearch('')
    setIsEditing(false)
  }, [savedSelectedMemberIds])

  const handleSave = React.useCallback(async () => {
    try {
      await updateAppMembers({ appID: appId, accountIds: selectedMemberIds })
      setSavedSelectedMemberIds(selectedMemberIds)
      setSearch('')
      setIsEditing(false)
    }
    catch (e: any) {
      notify({ type: 'error', message: e?.message || t('common.error.unknown') })
    }
  }, [appId, notify, selectedMemberIds, t, updateAppMembers])

  const listToRender = React.useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    const baseList = isEditing
      ? availableMembers
      : availableMembers.filter(m => savedSelectedMemberIds.includes(m.id))

    if (!normalizedSearch)
      return baseList

    return baseList.filter(m => (
      m.name?.toLowerCase().includes(normalizedSearch)
      || m.email?.toLowerCase().includes(normalizedSearch)
    ))
  }, [availableMembers, isEditing, savedSelectedMemberIds, search])

  return (
    <div className='mt-2'>
      {isEditing && (
        <SearchInput
          className='mb-2'
          value={search}
          onChange={setSearch}
        />
      )}
      <div className='max-h-56 overflow-y-auto rounded-lg border-[0.5px] border-divider-subtle bg-background-section p-2'>
        {listToRender.map(member => (
          <div key={member.id} className='flex items-center gap-2 rounded-md px-2 py-1 hover:bg-state-base-hover'>
            {isEditing && (
              <Checkbox
                id={`member-${member.id}`}
                checked={selectedMemberIds.includes(member.id)}
                onCheck={() => toggleMember(member.id)}
              />
            )}
            <div className='flex grow items-center justify-between' onClick={() => isEditing && toggleMember(member.id)}>
              <div className='system-sm-regular text-text-secondary'>{member.name}</div>
              <div className='system-xs-regular ml-2 text-text-tertiary'>{member.email}</div>
            </div>
          </div>
        ))}
        {listToRender.length === 0 && (
          <div className='system-xs-regular px-2 py-3 text-text-tertiary'>
            {isEditing
              ? (availableMembers.length === 0 ? t('app.access.notFound') : t('app.access.noAvailableMembers'))
              : t('app.access.noSelectedMembers')}
          </div>
        )}
      </div>
      <div className='mt-2 flex items-center justify-end gap-2'>
        {!isEditing && (
          <Button size={'small'} variant={'secondary'} onClick={handleStartEdit}>{t('common.operation.edit')}</Button>
        )}
        {isEditing && (
          <>
            <Button size={'small'} variant={'ghost'} onClick={handleCancelEdit}>{t('common.operation.cancel')}</Button>
            <Button size={'small'} disabled={isSaving} loading={isSaving} variant={'primary'} onClick={handleSave}>{t('common.operation.save')}</Button>
          </>
        )}
      </div>
    </div>
  )
}

export default WorkspaceMembersAccess
