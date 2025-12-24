'use client'

import type { ReactNode, RefObject } from 'react'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  createContext,
  useContextSelector,
} from 'use-context-selector'
import type { FilterState } from './filter-management'
import { useTabSearchParams } from '@/hooks/use-tab-searchparams'
import { noop } from 'lodash-es'
import { PLUGIN_PAGE_TABS_MAP, usePluginPageTabs } from '../hooks'
import { useGlobalPublicStore } from '@/context/global-public-context'
import useMainUserCheck from '@/hooks/use-main-user-check'
import { useCheckRoleAccess } from '@/hooks/shai/use-check-role-access'
import { AVI_ORGANIZATION_NAME } from '@/config'

export type PluginPageContextValue = {
  containerRef: RefObject<HTMLDivElement | null>
  currentPluginID: string | undefined
  setCurrentPluginID: (pluginID?: string) => void
  filters: FilterState
  setFilters: (filter: FilterState) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  options: Array<{ value: string, text: string }>
}

const emptyContainerRef: RefObject<HTMLDivElement | null> = { current: null }

export const PluginPageContext = createContext<PluginPageContextValue>({
  containerRef: emptyContainerRef,
  currentPluginID: undefined,
  setCurrentPluginID: noop,
  filters: {
    categories: [],
    tags: [],
    searchQuery: '',
  },
  setFilters: noop,
  activeTab: '',
  setActiveTab: noop,
  options: [],
})

type PluginPageContextProviderProps = {
  children: ReactNode
}

export function usePluginPageContext(selector: (value: PluginPageContextValue) => any) {
  return useContextSelector(PluginPageContext, selector)
}

export const PluginPageContextProvider = ({
  children,
}: PluginPageContextProviderProps) => {
  const { isMainUser } = useMainUserCheck()
  const { checkRoleAccess } = useCheckRoleAccess()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    tags: [],
    searchQuery: '',
  })
  const [currentPluginID, setCurrentPluginID] = useState<string | undefined>()

  const { enable_marketplace } = useGlobalPublicStore(s => s.systemFeatures)
  const tabs = usePluginPageTabs()
  const hideDifyMarketplace = process.env.NEXT_PUBLIC_ORGANIZATION_NAME === AVI_ORGANIZATION_NAME
  const options = useMemo(() => {
    if (isMainUser) {
      if (hideDifyMarketplace)
        return tabs.filter(tab => tab.value !== PLUGIN_PAGE_TABS_MAP.marketplace)
      return enable_marketplace ? tabs : tabs.filter(tab => tab.value !== PLUGIN_PAGE_TABS_MAP.marketplace)
    }

    if (checkRoleAccess(['owner', 'admin', 'editor'])) {
      return tabs.filter(tab => tab.value !== PLUGIN_PAGE_TABS_MAP.marketplace)
    }

    return tabs.filter(tab =>
      tab.value !== PLUGIN_PAGE_TABS_MAP.marketplace
      && tab.value !== PLUGIN_PAGE_TABS_MAP.marketplaceShai,
    )
  }, [tabs, enable_marketplace, isMainUser, checkRoleAccess, hideDifyMarketplace])
  const [activeTab, setActiveTab] = useTabSearchParams({
    defaultTab: options[0].value,
  })

  // Переключаем на первый таб если текущий недоступен
  const availableTabValues = useMemo(() => options.map(o => o.value), [options])

  useEffect(() => {
    if (activeTab && !availableTabValues.includes(activeTab) && options.length > 0) {
      setActiveTab(options[0].value)
    }
  }, [activeTab, availableTabValues, options, setActiveTab])

  return (
    <PluginPageContext.Provider
      value={{
        containerRef,
        currentPluginID,
        setCurrentPluginID,
        filters,
        setFilters,
        activeTab,
        setActiveTab,
        options,
      }}
    >
      {children}
    </PluginPageContext.Provider>
  )
}
