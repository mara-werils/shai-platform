'use client'

import Modal from '@/app/components/base/modal'
import Button from '@/app/components/base/button'
import SimpleBadge from '@/app/components/base/simple-badge'
import { RiBrain2Line, RiCheckboxCircleFill } from '@remixicon/react'
import { useEffect, useState } from 'react'
import Toast from '@/app/components/base/toast'
import { useCheckInstalled, useInstallPackageFromShaiMarketPlace, useInvalidateInstalledPluginList } from '@/service/use-plugins'
import { useTranslation } from 'react-i18next'

type PluginInstalledData = {
  name: string
  version: string
  typeLabel?: string
  description?: string
  icon?: string
  uniqueIdentifier?: string
  pluginId?: string
}

type Props = {
  isShow: boolean
  onClose: () => void
  data: PluginInstalledData
}

const PluginInstalledModal = ({ isShow, onClose, data }: Props) => {
  const { t } = useTranslation()
  const [snapshot, setSnapshot] = useState<PluginInstalledData>(data)
  const invalidateInstalled = useInvalidateInstalledPluginList()
  const { mutateAsync: installFromShai, isPending } = useInstallPackageFromShaiMarketPlace()
  const { data: installedData } = useCheckInstalled({
    pluginIds: snapshot.pluginId ? [snapshot.pluginId] : [],
    enabled: isShow && !!snapshot.pluginId,
  })
  const isInstalled = !!installedData && installedData.plugins.length > 0
  useEffect(() => {
    if (isShow)
      setSnapshot(data)
  }, [isShow, data])

  return (
    <Modal isShow={isShow} onClose={onClose} closable className='w-[800px] max-w-[800px] p-6' outsidePadding='px-4'>
      <div>
        <div className='text-[24px] font-semibold leading-[24px] text-[#181B20]'>
          {isInstalled ? t('plugin.upgrade.successfulTitle') : t('plugin.installModal.installPlugin')}
        </div>
        <div className='mt-6 text-[16px] leading-[16px] text-[#181B20]'>
          {isInstalled ? t('plugin.installModal.installedSuccessfullyDesc') : t('plugin.installModal.readyToInstall')}
        </div>

        {/* Короткий саммари о плагине */}
        <div className='relative mx-3 my-9 rounded-[16px] border border-[#E4E4E2] bg-components-panel-on-panel-item-bg px-5 py-6 shadow-[0_0_0_12px_rgba(34,60,80,0.03)]'>
          <div className='absolute right-0 top-0 flex h-[26px] items-center justify-center rounded-none rounded-bl-[8px] rounded-tr-[16px] bg-third-party-model-bg-default px-3 text-[12px] uppercase'>
            {snapshot.typeLabel || t('plugin.categorySingle.model')}
          </div>
          <div className='mb-6 flex items-start gap-5'>
            <div className='relative flex h-12 w-12 items-center justify-center rounded-[12px] bg-components-panel-on-panel-item-bg'>
              {snapshot.icon ? (
                <img src={snapshot.icon} alt='' className='h-full w-full object-contain' />
              ) : (
                <RiBrain2Line className='h-5 w-5 text-text-tertiary' />
              )}
              {isInstalled && (
                <span className='absolute bottom-[-2px] right-[-10px] h-6 w-6'>
                  <span className='absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white' />
                  <RiCheckboxCircleFill className='relative h-6 w-6 text-text-success' />
                </span>
              )}
            </div>
            <div className='flex min-w-0 flex-col'>
              <div className='flex items-center gap-2'>
                <div className='line-clamp-1 text-[16px] font-medium text-util-colors-gray-gray-600'>{snapshot.name}</div>
                <SimpleBadge className='px-3 text-[13px]'>{snapshot.version}</SimpleBadge>
              </div>
            </div>
          </div>
          {!!snapshot.description && (
            <div className='mt-2 line-clamp-2 text-[14px] font-light text-util-colors-gray-gray-600'>
              {snapshot.description}
            </div>
          )}
        </div>

        <div className='mt-6 flex justify-end'>
          {isInstalled ? (
            <Button
              variant='primary'
              className='h-9 rounded-[8px] px-4 text-[16px]'
              onClick={onClose}
            >
              {t('plugin.installModal.close')}
            </Button>
          ) : (
            <Button
              variant='primary'
              className='h-9 rounded-[8px] px-4 text-[16px]'
              disabled={isPending}
              onClick={async () => {
                if (!snapshot.uniqueIdentifier) {
                  Toast.notify({ type: 'error', message: t('plugin.installModal.installFailed') })
                  return
                }
                try {
                  await installFromShai(snapshot.uniqueIdentifier as string)
                  Toast.notify({ type: 'success', message: t('plugin.installModal.installing') })
                  invalidateInstalled()
                  onClose()
                }
                catch {
                  console.log(t('plugin.installModal.installFailed'))
                  Toast.notify({ type: 'error', message: t('plugin.installModal.installFailed') })
                }
              }}
            >
              {t('plugin.installAction')}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default PluginInstalledModal
