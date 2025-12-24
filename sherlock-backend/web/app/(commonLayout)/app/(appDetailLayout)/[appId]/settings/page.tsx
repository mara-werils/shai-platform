'use client'

import type { FC } from 'react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  RiDeleteBinLine,
  RiEditLine,
  RiExchange2Line,
  RiFileCopy2Line,
  RiFileDownloadLine,
  RiFileUploadLine,
} from '@remixicon/react'
import { useContextSelector } from 'use-context-selector'
import AppIcon from '@/app/components/base/app-icon'
import Divider from '@/app/components/base/divider'
import WorkspaceMembersAccess from './components/workspace-members-access'
import Button from '@/app/components/base/button'
import Confirm from '@/app/components/base/confirm'
import { SimpleSelect } from '@/app/components/base/select'
import { useUpdateAppAccessMode } from '@/service/use-apps'
import type { Item } from '@/app/components/base/select'
import CardView from '@/app/(commonLayout)/app/(appDetailLayout)/[appId]/overview/card-view'
import DuplicateAppModal from '@/app/components/app/duplicate-modal'
import type { DuplicateAppModalProps } from '@/app/components/app/duplicate-modal'
import CreateAppModal from '@/app/components/explore/create-app-modal'
import type { CreateAppModalProps } from '@/app/components/explore/create-app-modal'
import UpdateDSLModal from '@/app/components/workflow/update-dsl-modal'
import type { EnvironmentVariable } from '@/app/components/workflow/types'
import DSLExportConfirmModal from '@/app/components/workflow/dsl-export-confirm-modal'
import AppsContext, { useAppContext } from '@/context/app-context'
import { useProviderContext } from '@/context/provider-context'
import { useStore as useAppStore } from '@/app/components/app/store'
import { NEED_REFRESH_APP_LIST_KEY } from '@/config'
import { getRedirection } from '@/utils/app-redirection'
import { copyApp, deleteApp, exportAppConfig, updateAppInfo } from '@/service/apps'
import { fetchWorkflowDraft } from '@/service/workflow'
import { useToastContext } from '@/app/components/base/toast'
import SwitchAppModal from '@/app/components/app/switch-app-modal'
import { useAppAccess, useAppMembers } from '@/service/use-apps'
import { HideFor } from '@/app/components/base/guards/role-guards'
import { Roles } from '@/types/app'

const SettingsPage: FC = () => {
  const { t } = useTranslation()
  const { notify } = useToastContext()
  const { onPlanInfoChanged } = useProviderContext()
  // keep hook for parity with modal, reserved for possible ACL display
  const { isCurrentWorkspaceEditor: _isCurrentWorkspaceEditor } = useAppContext()
  const appDetail = useAppStore(state => state.appDetail)
  const setAppDetail = useAppStore(state => state.setAppDetail)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [showSwitchModal, setShowSwitchModal] = useState<boolean>(false)
  const [showImportDSLModal, setShowImportDSLModal] = useState<boolean>(false)
  const [secretEnvList, setSecretEnvList] = useState<EnvironmentVariable[]>([])
  const [accessMode, setAccessMode] = useState<'only_me' | 'all_team_members' | 'partial_members'>('only_me')
  const { data: accessData } = useAppAccess(appDetail?.id, Boolean(appDetail?.id))
  React.useEffect(() => {
    if (accessData?.access)
      setAccessMode(accessData.access)
  }, [accessData])
  const { mutateAsync: updateAppAccessMode } = useUpdateAppAccessMode()
  // workspace members access selection moved into separate component

  const accessItems: Item[] = [
    { value: 'only_me', name: t('app.access.onlyMe') },
    { value: 'all_team_members', name: t('app.access.allTeam') },
    { value: 'partial_members', name: t('app.access.partialMembers') },
  ]

  const mutateApps = useContextSelector(
    AppsContext,
    state => state.mutateApps,
  )

  const onEdit: CreateAppModalProps['onConfirm'] = React.useCallback(async ({
    name,
    icon_type,
    icon,
    icon_background,
    description,
    use_icon_as_answer_icon,
  }) => {
    if (!appDetail)
      return
    try {
      const app = await updateAppInfo({
        appID: appDetail.id,
        name,
        icon_type,
        icon,
        icon_background,
        description,
        use_icon_as_answer_icon,
      })
      setShowEditModal(false)
      notify({ type: 'success', message: t('app.editDone') })
      setAppDetail(app)
      mutateApps()
    }
    catch {
      notify({ type: 'error', message: t('app.editFailed') })
    }
  }, [appDetail, mutateApps, notify, setAppDetail, t])

  const onCopy: DuplicateAppModalProps['onConfirm'] = async ({ name, icon_type, icon, icon_background }) => {
    if (!appDetail)
      return
    try {
      const newApp = await copyApp({
        appID: appDetail.id,
        name,
        icon_type,
        icon,
        icon_background,
        mode: appDetail.mode,
      })
      setShowDuplicateModal(false)
      notify({ type: 'success', message: t('app.newApp.appCreated') })
      localStorage.setItem(NEED_REFRESH_APP_LIST_KEY, '1')
      mutateApps()
      onPlanInfoChanged()
      getRedirection(true, newApp, (path) => {
        window.location.href = path
      })
    }
    catch {
      notify({ type: 'error', message: t('app.newApp.appCreateFailed') })
    }
  }

  const onExport = async (include = false) => {
    if (!appDetail)
      return
    try {
      const { data } = await exportAppConfig({ appID: appDetail.id, include })
      const a = document.createElement('a')
      const file = new Blob([data], { type: 'application/yaml' })
      a.href = URL.createObjectURL(file)
      a.download = `${appDetail.name}.yml`
      a.click()
    }
    catch {
      notify({ type: 'error', message: t('app.exportFailed') })
    }
  }

  const exportCheck = async () => {
    if (!appDetail)
      return
    if (appDetail.mode !== 'workflow' && appDetail.mode !== 'advanced-chat') {
      onExport()
      return
    }
    try {
      const workflowDraft = await fetchWorkflowDraft(`/apps/${appDetail.id}/workflows/draft`)
      const list = (workflowDraft.environment_variables || []).filter(env => env.value_type === 'secret')
      if (list.length === 0) {
        onExport()
        return
      }
      setSecretEnvList(list)
    }
    catch {
      notify({ type: 'error', message: t('app.exportFailed') })
    }
  }

  const onConfirmDelete = React.useCallback(async () => {
    if (!appDetail)
      return
    try {
      await deleteApp(appDetail.id)
      notify({ type: 'success', message: t('app.appDeleted') })
      mutateApps()
      onPlanInfoChanged()
      setAppDetail()
      window.location.href = '/apps'
    }
    catch (e: any) {
      notify({ type: 'error', message: `${t('app.appDeleteFailed')}${'message' in e ? `: ${e.message}` : ''}` })
    }
    setShowConfirmDelete(false)
  }, [appDetail, mutateApps, notify, onPlanInfoChanged, setAppDetail, t])

  // handlers moved into component

  // Trigger members fetch on settings page load
  useAppMembers(appDetail?.id)

  if (!appDetail)
    return null

  return (
    <div className="h-full overflow-auto bg-white">
      <div className='mx-auto max-w-[960px] px-3 py-6'>
        <div className='mb-3 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <AppIcon
              size="large"
              iconType={appDetail.icon_type}
              icon={appDetail.icon}
              background={appDetail.icon_background}
              imageUrl={appDetail.icon_url}
            />
            <div className='flex w-full grow flex-col'>
              <div className='system-lg-semibold text-text-secondary'>{appDetail.name}</div>
              <div className='system-2xs-medium-uppercase text-text-tertiary'>
                {appDetail.mode === 'advanced-chat' ? t('app.types.advanced') : appDetail.mode === 'agent-chat' ? t('app.types.agent') : appDetail.mode === 'chat' ? t('app.types.chatbot') : appDetail.mode === 'completion' ? t('app.types.completion') : t('app.types.workflow')}
              </div>
            </div>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <Button size={'small'} variant={'secondary'} className='gap-[1px]' onClick={() => setShowEditModal(true)}>
              <RiEditLine className='h-3.5 w-3.5 text-components-button-secondary-text' />
              <span className='system-xs-medium text-components-button-secondary-text'>{t('app.editApp')}</span>
            </Button>
            <Button size={'small'} variant={'secondary'} className='gap-[1px]' onClick={() => setShowDuplicateModal(true)}>
              <RiFileCopy2Line className='h-3.5 w-3.5 text-components-button-secondary-text' />
              <span className='system-xs-medium text-components-button-secondary-text'>{t('app.duplicate')}</span>
            </Button>
            <Button size={'small'} variant={'secondary'} className='gap-[1px]' onClick={exportCheck}>
              <RiFileDownloadLine className='h-3.5 w-3.5 text-components-button-secondary-text' />
              <span className='system-xs-medium text-components-button-secondary-text'>{t('app.export')}</span>
            </Button>
            {(appDetail.mode === 'advanced-chat' || appDetail.mode === 'workflow') && (
              <Button size={'small'} variant={'secondary'} className='gap-[1px]' onClick={() => setShowImportDSLModal(true)}>
                <RiFileUploadLine className='h-3.5 w-3.5 text-components-button-secondary-text' />
                <span className='system-xs-medium text-components-button-secondary-text'>{t('workflow.common.importDSL')}</span>
              </Button>
            )}
            {(appDetail.mode === 'completion' || appDetail.mode === 'chat') && (
              <Button size={'small'} variant={'secondary'} className='gap-[1px]' onClick={() => setShowSwitchModal(true)}>
                <RiExchange2Line className='h-3.5 w-3.5 text-components-button-secondary-text' />
                <span className='system-xs-medium text-components-button-secondary-text'>{t('app.switch')}</span>
              </Button>
            )}
          </div>
        </div>
        {appDetail.description && (
          <div className='system-xs-regular mb-4 text-text-tertiary'>{appDetail.description}</div>
        )}
        <Divider />
        <div className='mt-4'>
          <CardView appId={appDetail.id} isInPanel={true} className='flex grow flex-col gap-2' />
        </div>
        <div className='mt-4 flex flex-col gap-2 px-3'>
          <div className='system-sm-semibold py-1 text-text-secondary'>{t('app.access.title')}</div>
          <SimpleSelect
            key={accessMode}
            wrapperClassName='w-full'
            items={accessItems}
            defaultValue={accessMode}
            onSelect={async (item) => {
              const value = item.value as 'only_me' | 'all_team_members' | 'partial_members'
              const prev = accessMode
              setAccessMode(value)
              if (!appDetail)
                return
              try {
                await updateAppAccessMode({ appID: appDetail.id, accessType: value })
              }
              catch (e: any) {
                setAccessMode(prev)
                let backendMsg: string | undefined
                try {
                  if (e && typeof e.json === 'function') {
                    const data = await e.json()
                    backendMsg = data?.message
                  }
                }
                catch {}
                const msg = backendMsg === 'permission denied' ? t('app.access.permissionDenied') : (backendMsg || e?.message || t('common.error.unknown'))
                notify({ type: 'error', message: msg as string })
              }
            }}
            notClearable
          />
          {accessMode === 'partial_members' && (
            <WorkspaceMembersAccess appId={appDetail.id} />
          )}
        </div>
        <Divider className='my-4' />
        <div className='flex min-h-fit items-center justify-start gap-2'>
          <HideFor roles={[Roles.normal, Roles.editor]}>
            <Button size={'medium'} variant={'ghost'} className='gap-0.5' onClick={() => setShowConfirmDelete(true)}>
              <RiDeleteBinLine className='h-4 w-4 text-text-tertiary' />
              <span className='system-sm-medium text-text-tertiary'>{t('common.operation.deleteApp')}</span>
            </Button>
          </HideFor>
        </div>
      </div>

      {showDuplicateModal && (
        <DuplicateAppModal
          appName={appDetail.name}
          icon_type={appDetail.icon_type}
          icon={appDetail.icon}
          icon_background={appDetail.icon_background}
          icon_url={appDetail.icon_url}
          show={showDuplicateModal}
          onConfirm={onCopy}
          onHide={() => setShowDuplicateModal(false)}
        />
      )}
      {showEditModal && (
        <CreateAppModal
          isEditModal
          appName={appDetail.name}
          appIconType={appDetail.icon_type}
          appIcon={appDetail.icon}
          appIconBackground={appDetail.icon_background}
          appIconUrl={appDetail.icon_url}
          appDescription={appDetail.description}
          appMode={appDetail.mode}
          appUseIconAsAnswerIcon={appDetail.use_icon_as_answer_icon}
          show={showEditModal}
          onConfirm={onEdit}
          onHide={() => setShowEditModal(false)}
        />
      )}
      {showConfirmDelete && (
        <Confirm
          title={t('app.deleteAppConfirmTitle')}
          content={t('app.deleteAppConfirmContent')}
          isShow={showConfirmDelete}
          onConfirm={onConfirmDelete}
          onCancel={() => setShowConfirmDelete(false)}
        />
      )}
      {showSwitchModal && (
        <SwitchAppModal
          inAppDetail
          show={showSwitchModal}
          appDetail={appDetail}
          onClose={() => setShowSwitchModal(false)}
          onSuccess={() => setShowSwitchModal(false)}
        />
      )}
      {showImportDSLModal && (
        <UpdateDSLModal onCancel={() => setShowImportDSLModal(false)} onBackup={exportCheck} />
      )}
      {secretEnvList.length > 0 && (
        <DSLExportConfirmModal envList={secretEnvList} onConfirm={onExport} onClose={() => setSecretEnvList([])} />
      )}
    </div>
  )
}

export default React.memo(SettingsPage)
