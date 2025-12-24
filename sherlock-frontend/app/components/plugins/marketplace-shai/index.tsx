'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAutoHideTopBar } from './hooks/useAutoHideTopBar'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import TopBar from './components/TopBar'
import Grid from './components/cards/Grid'
import PluginInstalledModal from './components/PluginInstalledModal'
import Loading from '@/app/components/base/loading'
import { useTranslation } from 'react-i18next'
import type { MarketItem, Tab } from '@/types/marketplace-shai'
import { useShaiExtensionsInfiniteQuery } from '@/hooks/shai/marketplace/use-marketplace'
import { compareVersion } from '@/utils/semver'

type LabelKey = 'ru_RU' | 'kz_KZ' | 'en_US'

function mapExtToMarketItem(ext: any, key: LabelKey, currentTab: Tab): MarketItem {
  const title = (ext.label && (ext.label[key] || ext.label.en_US || ext.label.ru_RU)) || ext.name
  const description = (ext.brief && (ext.brief[key] || ext.brief.en_US || ext.brief.ru_RU)) || ''
  const versions: Array<{ version: string; identifier: string }> = Array.isArray((ext as any).versions) ? (ext as any).versions : []
  let latestIdentifier = ''
  if (versions.length > 0) {
    const latest = versions.reduce((acc, v) => (!acc ? v : (compareVersion(v.version, acc.version) > 0 ? v : acc)), versions[0])
    latestIdentifier = latest?.identifier || ''
  }
  return {
    id: ext.id,
    plugin_id: ext.plugin_id,
    title,
    description,
    installs: ext.install_count ?? 0,
    icon: ext.icon || '',
    type: (currentTab === 'all' ? (ext.category as any) : currentTab),
    category: ext.category,
    uniqueIdentifier: latestIdentifier,
  }
}

const MarketplaceShai = () => {
  const { i18n } = useTranslation()
  const sp = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  // Инициализируем таб из URL один раз (только новые значения)
  const tParam = sp.get('t')
  const initialTab: Tab = (tParam === 'all' || tParam === 'model' || tParam === 'tool' || tParam === 'agent-strategy' || tParam === 'extension')
    ? (tParam as Tab)
    : 'all'
  const [tab, setTab] = useState<Tab>(initialTab)
  const [qLocal, setQLocal] = useState(() => sp.get('q') ?? '')

  // Дебаунс-синхронизация поиска в URL (односторонняя запись)
  useEffect(() => {
    const id = setTimeout(() => {
      const currentQ = sp.get('q') ?? ''
      if (currentQ === qLocal) return
      const params = new URLSearchParams(sp.toString())
      if (!qLocal) params.delete('q')
      else params.set('q', qLocal)
      const qs = params.toString()
      const url = qs ? `${pathname}?${qs}` : pathname
      router.replace(url, { scroll: false })
    }, 350)
    return () => clearTimeout(id)
  }, [qLocal, sp, pathname, router])

  // tab == категории API, кроме 'all'
  const apiCategory = useMemo(() => (tab === 'all' ? undefined : tab), [tab])

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useShaiExtensionsInfiniteQuery({
    category: apiCategory,
    name: qLocal || undefined,
    size: 32,
  })

  const items = useMemo<MarketItem[]>(() => {
    const pages = (data as any)?.pages as Array<{ items: any[] }> | undefined
    const raw = pages ? pages.flatMap(p => p.items) : []
    const lang = i18n.language
    let key: 'ru_RU' | 'kz_KZ' | 'en_US' = 'en_US'
    if (lang === 'ru-RU') key = 'ru_RU'
    else if (lang === 'kk-KZ') key = 'kz_KZ'
    return raw.map((ext: any) => mapExtToMarketItem(ext, key, tab))
  }, [data, tab, i18n.language])

  const [installedData, setInstalledData] = useState<null | { name: string; version: string; typeLabel?: string; description?: string; icon?: string; uniqueIdentifier?: string; pluginId?: string }>(null)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const { topBarRef, hide: hideTopBar } = useAutoHideTopBar({ scrollContainerId: 'marketplace-container', deltaThreshold: 8, thresholdOffsetPx: 0 })

  const handleTabChange = useCallback((t: string) => {
    setTab(t as Tab)
    const params = new URLSearchParams(sp.toString())
    if (t) params.set('t', String(t))
    else params.delete('t')
    const qs = params.toString()
    const url = qs ? `${pathname}?${qs}` : pathname
    router.replace(url, { scroll: false })
  }, [pathname, router, sp])

  const handleInstallSuccess = useCallback((item: MarketItem) => {
    setInstalledData({ name: item.title || '', version: '0.0.6', typeLabel: 'ИНСТРУМЕНТ', description: item.description || '', icon: item.icon, uniqueIdentifier: item.uniqueIdentifier, pluginId: item.plugin_id })
  }, [])

  useEffect(() => {
    if (!loaderRef.current) return
    if (!hasNextPage) return
    const io = new IntersectionObserver((entries) => {
      const first = entries[0]
      if (first.isIntersecting) fetchNextPage()
    }, { rootMargin: '600px 0px' })
    io.observe(loaderRef.current)
    return () => io.disconnect()
  }, [fetchNextPage, hasNextPage])

  return (
    <div id='marketplace-container' className='relative flex grow flex-col bg-background-default'>
      <PluginInstalledModal
        isShow={!!installedData}
        onClose={() => setInstalledData(null)}
        data={installedData ?? { name: '', version: '', typeLabel: '', description: '', icon: '', uniqueIdentifier: '', pluginId: '' }}
      />
      <div ref={topBarRef} className={`sticky top-[60px] z-10 transition-transform duration-200 will-change-transform ${hideTopBar ? '-translate-y-full' : 'translate-y-0'}`}>
        <TopBar
          tab={tab}
          query={qLocal}
          onTabChange={handleTabChange}
          onSearchChange={setQLocal}
        />
      </div>
      <Grid
        items={items}
        loading={isLoading && !(data as any)?.pages?.length}
        onInstallSuccess={handleInstallSuccess}
      />

      <div className='mt-2 flex items-center justify-center'>
        {isFetchingNextPage ? (
          <div className='w-full'>
            <Loading />
          </div>
        ) : hasNextPage ? (
          <div ref={loaderRef} className='h-0.5 w-0.5' />
        ) : null}
      </div>
    </div>
  )
}

export default MarketplaceShai
