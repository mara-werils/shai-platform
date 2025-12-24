'use client'
import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { useContext } from 'use-context-selector'
import {
  RiUserAddLine,
  RiPencilLine,
  RiHistoryLine,
  RiLockUnlockLine,
  RiMoreFill,
  RiArrowDownSLine,
} from '@remixicon/react'
import { useTranslation } from 'react-i18next'
import InviteModal from './invite-modal'
import InvitedModal from './invited-modal'
import EditWorkspaceModal from './edit-workspace-modal'
import TransferOwnershipModal from './transfer-ownership-modal'
import Operation from './operation'
import TransferOwnership from './operation/transfer-ownership'
import { fetchMembers } from '@/service/common'
import I18n from '@/context/i18n'
import { useAppContext } from '@/context/app-context'
import Avatar from '@/app/components/base/avatar'
import type { InvitationResult } from '@/models/common'
import { useProviderContext } from '@/context/provider-context'
import { Plan } from '@/app/components/billing/type'
import Button from '@/app/components/base/button'
import UpgradeBtn from '@/app/components/billing/upgrade-btn'
import { NUM_INFINITE } from '@/app/components/billing/config'
import { LanguagesSupported } from '@/i18n-config/language'
import cn from '@/utils/classnames'
import Tooltip from '@/app/components/base/tooltip'
import { useGlobalPublicStore } from '@/context/global-public-context'
import { useFormatTimeFromNow } from '@/hooks/use-format-time-from-now'
import MemberStatusBadge from './member-status-badge'
import useMainUserCheck from '@/hooks/use-main-user-check'
import { ToastContext } from '@/app/components/base/toast'
import { updateMemberStatus } from '@/service/shai/members'
import { SimpleSelect } from '@/app/components/base/select'
import type { Item } from '@/app/components/base/select'
import SearchInput from '@/app/components/base/search-input'

type MembersPageProps = {
  onOpenLoginHistory?: (userId: string) => void
}

const MembersPage = ({ onOpenLoginHistory }: MembersPageProps) => {
  const { t } = useTranslation()
  const { notify } = useContext(ToastContext)
  const RoleMap = {
    owner: t('common.members.owner'),
    admin: t('common.members.admin'),
    editor: t('common.members.editor'),
    dataset_operator: t('common.members.datasetOperator'),
    normal: t('common.members.normal'),
  }
  const { locale } = useContext(I18n)

  const { userProfile, currentWorkspace, isCurrentWorkspaceOwner, isCurrentWorkspaceManager } = useAppContext()
  const { isMainUser } = useMainUserCheck()
  const { data, mutate } = useSWR(
    {
      url: '/workspaces/current/members',
      params: {},
    },
    fetchMembers,
  )
  const { systemFeatures } = useGlobalPublicStore()
  const { formatTimeFromNow } = useFormatTimeFromNow()
  const [inviteModalVisible, setInviteModalVisible] = useState(false)
  const [invitationResults, setInvitationResults] = useState<InvitationResult[]>([])
  const [invitedModalVisible, setInvitedModalVisible] = useState(false)
  const accounts = data?.accounts || []
  const { plan, enableBilling, isAllowTransferWorkspace } = useProviderContext()
  const isNotUnlimitedMemberPlan = enableBilling && plan.type !== Plan.team && plan.type !== Plan.enterprise
  const isMemberFull = enableBilling && isNotUnlimitedMemberPlan && accounts.length >= plan.total.teamMembers
  const [editWorkspaceModalVisible, setEditWorkspaceModalVisible] = useState(false)
  const [showTransferOwnershipModal, setShowTransferOwnershipModal] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const canShowActions = isMainUser || currentWorkspace?.role === 'owner' || currentWorkspace?.role === 'admin'
  const canViewSensitiveColumns = ['owner', 'admin', 'editor'].includes(currentWorkspace?.role || '')

  const handleMenuToggle = (id: string) => {
    if (openMenuId === id) {
      setOpenMenuId(null)
    } else {
      setOpenMenuId(id)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !(event.target as Element).closest('.menu-container')) {
        setOpenMenuId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openMenuId])

  const handleToggleMemberStatus = async (accountId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'banned' : 'active'
      await updateMemberStatus(accountId, newStatus)
      notify({
        type: 'success',
        message: newStatus === 'banned' ? t('common.members.accountBlocked') : t('common.members.accountUnblocked'),
      })
      mutate()
      setOpenMenuId(null)
    }
    catch (error) {
      notify({
        type: 'error',
        message: (error as Error).message || t('common.actionMsg.modifiedUnsuccessfully'),
      })
    }
  }

  const filterOptions: Item[] = [
    { value: 'all', name: t('common.members.filterAllMembers') },
    { value: 'active', name: t('common.members.filterActiveMembers') },
    { value: 'banned', name: t('common.members.filterBannedMembers') },
  ]

  const filteredAccounts = accounts.filter(account => {
    // Filter by status
    if (statusFilter === 'active' && account.status !== 'active') return false
    if (statusFilter === 'banned' && account.status !== 'banned') return false

    // Filter by search query (name)
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase().trim()
      const nameMatch = account.name?.toLowerCase().includes(searchLower)
      const emailMatch = account.email?.toLowerCase().includes(searchLower)
      if (!nameMatch && !emailMatch) return false
    }

    return true
  })

  return (
    <>
      <div className='flex flex-col'>
        <div className='mb-4 flex items-center gap-3 rounded-xl border-l-[0.5px] border-t-[0.5px] border-divider-subtle bg-gradient-to-r from-background-gradient-bg-fill-chat-bg-2 to-background-gradient-bg-fill-chat-bg-1 p-3 pr-5'>
          <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-components-icon-bg-blue-solid text-[20px]'>
            <span className='bg-gradient-to-r from-components-avatar-shape-fill-stop-0 to-components-avatar-shape-fill-stop-100 bg-clip-text font-semibold uppercase text-shadow-shadow-1 opacity-90'>{currentWorkspace?.name[0]?.toLocaleUpperCase()}</span>
          </div>
          <div className='grow'>
            <div className='system-md-semibold flex items-center gap-1 text-text-secondary'>
              <span>{currentWorkspace?.name}</span>
              {isCurrentWorkspaceOwner && <span>
                <Tooltip
                  popupContent={t('common.account.editWorkspaceInfo')}
                >
                  <div
                    className='cursor-pointer rounded-md p-1 hover:bg-black/5'
                    onClick={() => {
                      setEditWorkspaceModalVisible(true)
                    }}
                  >
                    <RiPencilLine className='h-4 w-4 text-text-tertiary' />
                  </div>
                </Tooltip>
              </span>}
            </div>
            <div className='system-xs-medium mt-1 text-text-tertiary'>
              {enableBilling && isNotUnlimitedMemberPlan
                ? (
                  <div className='flex space-x-1'>
                    <div>{t('billing.plansCommon.member')}{locale !== LanguagesSupported[1] && accounts.length > 1 && 's'}</div>
                    <div className=''>{accounts.length}</div>
                    <div>/</div>
                    <div>{plan.total.teamMembers === NUM_INFINITE ? t('billing.plansCommon.unlimited') : plan.total.teamMembers}</div>
                  </div>
                )
                : (
                  <div className='flex space-x-1'>
                    <div>{accounts.length}</div>
                    <div>{t('billing.plansCommon.memberAfter')}{locale !== LanguagesSupported[1] && accounts.length > 1 && 's'}</div>
                  </div>
                )}
            </div>

          </div>
          {isMemberFull && (
            <UpgradeBtn className='mr-2' loc='member-invite' />
          )}
          <Button variant='primary' className={cn('shrink-0')} disabled={!isCurrentWorkspaceManager || isMemberFull} onClick={() => setInviteModalVisible(true)}>
            <RiUserAddLine className='mr-1 h-4 w-4' />
            {t('common.members.invite')}
          </Button>
        </div>
        {canViewSensitiveColumns && (
          <div className='mb-4 flex items-center gap-3'>
            <SimpleSelect
              defaultValue={statusFilter}
              items={filterOptions}
              onSelect={(item) => setStatusFilter(item.value as string)}
              wrapperClassName='[&_button]:!w-auto min-w-[200px]'
              renderTrigger={(selectedItem) => (
                <div className='flex h-9 w-full items-center rounded-lg border border-[#E7E8EA] bg-[#F9FAFB] pl-3 pr-2 sm:text-sm sm:leading-6 cursor-pointer'>
                  <span className='block truncate text-left system-sm-regular text-components-input-text-filled whitespace-nowrap'>
                    {selectedItem?.name ?? t('common.members.filterAllMembers')}
                  </span>
                  <RiArrowDownSLine className='ml-2 h-4 w-4 shrink-0 text-text-quaternary' />
                </div>
              )}
            />
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t('common.operation.search')}
              className='min-w-[240px] max-w-[300px]'
            />
          </div>
        )}
        <div className='overflow-visible lg:overflow-visible'>
          <div className='flex w-full min-w-[480px] items-center border-b border-divider-regular py-[7px]'>
            <div className='system-xs-medium-uppercase w-[250px] shrink-0 px-3 text-text-tertiary'>{t('common.members.name')}</div>
            <div className='system-xs-medium-uppercase w-[240px] shrink-0 px-3 text-text-tertiary'>{t('common.members.lastActive')}</div>
            {canViewSensitiveColumns && (
              <div className='system-xs-medium-uppercase w-[130px] shrink-0 px-3 text-text-tertiary'>{t('common.members.ip')}</div>
            )}
            <div className='system-xs-medium-uppercase w-[130px] shrink-0 px-3 text-text-tertiary'>{t('common.members.role')}</div>
            {canViewSensitiveColumns && (
              <div className='system-xs-medium-uppercase w-[120px] shrink-0 px-3 text-text-tertiary'>{t('common.members.status')}</div>
            )}
            {canShowActions && (
              <div className='system-xs-medium-uppercase w-[80px] shrink-0 px-3 text-right text-text-tertiary'>{t('common.members.actions')}</div>
            )}
          </div>
          <div className='relative w-full min-w-[480px]'>
            {
              filteredAccounts.map(account => {
                const memberStatus = account.status === 'active' ? 'active' : account.status === 'banned' ? 'banned' : 'inactive'
                const isAccountActive = account.status === 'active'
                const canBlockUnblock = account.status === 'active' || account.status === 'banned'

                return (
                  <div key={account.id} className='flex w-full border-b border-divider-subtle'>
                    <div className='flex w-[250px] shrink-0 items-center px-3 py-2'>
                      <Avatar avatar={account.avatar_url} size={24} className='mr-2' name={account.name} />
                      <div className=''>
                        <div className='system-sm-medium text-text-secondary'>
                          {account.name}
                          {account.status === 'pending' && <span className='system-xs-medium ml-1 text-text-warning'>{t('common.members.pending')}</span>}
                          {userProfile.email === account.email && <span className='system-xs-regular text-text-tertiary'>{t('common.members.you')}</span>}
                        </div>
                        <div className='system-xs-regular text-text-tertiary'>{account.email}</div>
                      </div>
                    </div>
                    <div className='system-sm-regular flex w-[240px] shrink-0 items-center px-3 py-2 text-text-secondary'>{formatTimeFromNow(Number((account.last_active_at || account.created_at)) * 1000)}</div>
                    {canViewSensitiveColumns && (
                      <div className='system-sm-regular flex w-[130px] shrink-0 items-center px-3 py-2 text-text-secondary'>
                        {account.last_login_ip || '-'}
                      </div>
                    )}
                    <div className='flex w-[130px] shrink-0 items-center'>
                      {isCurrentWorkspaceOwner && account.role === 'owner' && isAllowTransferWorkspace && (
                        <TransferOwnership onOperate={() => setShowTransferOwnershipModal(true)}></TransferOwnership>
                      )}
                      {isCurrentWorkspaceManager && !isCurrentWorkspaceOwner && account.role === 'owner' && (
                        <div className='system-sm-regular px-3 text-text-secondary'>{RoleMap[account.role] || RoleMap.normal}</div>
                      )}
                      {isCurrentWorkspaceManager && account.role !== 'owner' && (
                        <Operation member={account} operatorRole={currentWorkspace.role} onOperate={mutate} />
                      )}
                      {!isCurrentWorkspaceManager && (
                        <div className='system-sm-regular px-3 text-text-secondary'>{RoleMap[account.role] || RoleMap.normal}</div>
                      )}
                    </div>
                    {canViewSensitiveColumns && (
                      <div className='flex w-[120px] shrink-0 items-center px-3 py-2'>
                        <MemberStatusBadge status={memberStatus} />
                      </div>
                    )}
                    {(() => {
                      if (account.role === 'owner') {
                        const canViewOwnerActions = isCurrentWorkspaceOwner || isMainUser
                        if (!canViewOwnerActions) return null
                      } else {
                        if (!canShowActions) return null
                      }
                      return (
                      <div className='flex w-[80px] shrink-0 items-center justify-end px-3 py-2 overflow-visible'>
                      <div className='relative menu-container'>
                        <Button
                          type='button'
                          variant='ghost'
                          className='p-1'
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMenuToggle(account.id)
                          }}
                        >
                          <RiMoreFill className='h-4 w-4 text-text-tertiary' />
                        </Button>

                        {openMenuId === account.id && (
                          <div
                            className='absolute right-0 top-full z-50 mt-1 w-64 rounded-md border border-components-panel-border bg-components-panel-bg shadow-lg menu-container'
                          >
                            <div className="px-2 py-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setOpenMenuId(null)
                                  if (onOpenLoginHistory) {
                                    onOpenLoginHistory(account.id)
                                  }
                                }}
                                className="flex items-center w-full rounded-md text-left px-2 py-2 text-sm text-text-secondary hover:bg-state-base-hover"
                              >
                                <RiHistoryLine className="h-4 w-4 mr-2" />
                                {t('common.members.loginHistoryAction')}
                              </button>
                              {canBlockUnblock && (
                                <>
                                  <hr className="my-1 border-divider-subtle" />
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleToggleMemberStatus(account.id, account.status)
                                    }}
                                    className={cn(
                                      "flex items-center w-full rounded-md text-left px-2 py-2 text-sm hover:bg-state-base-hover",
                                      isAccountActive ? "text-red-600" : "text-text-secondary"
                                    )}
                                  >
                                    <RiLockUnlockLine className="h-4 w-4 mr-2" />
                                    {isAccountActive ? t('common.members.blockAccount') : t('common.members.unblockAccount')}
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                      )
                    })()}
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
      {
        inviteModalVisible && (
          <InviteModal
            isEmailSetup={systemFeatures.is_email_setup}
            onCancel={() => setInviteModalVisible(false)}
            onSend={(invitationResults) => {
              setInvitedModalVisible(true)
              setInvitationResults(invitationResults)
              mutate()
            }}
          />
        )
      }
      {
        invitedModalVisible && (
          <InvitedModal
            invitationResults={invitationResults}
            onCancel={() => setInvitedModalVisible(false)}
          />
        )
      }
      {
        editWorkspaceModalVisible && (
          <EditWorkspaceModal
            onCancel={() => setEditWorkspaceModalVisible(false)}
          />
        )
      }
      {showTransferOwnershipModal && (
        <TransferOwnershipModal
          show={showTransferOwnershipModal}
          onClose={() => setShowTransferOwnershipModal(false)}
        />
      )}
    </>
  )
}

export default MembersPage
