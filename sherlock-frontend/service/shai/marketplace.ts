import { getShaiMarketplace } from '@/service/base'

export type I18nField = {
  en_US: string
  ru_RU?: string | null
  kz_KZ?: string | null
}

export type ExtensionCategory = 'model' | 'tool' | 'agent-strategy' | 'extension' | 'bundle'
export type ExtensionType = 'plugin' | 'bundle' | 'model' | 'extension' | 'tool' | 'agent_strategy'
export type ExtensionVerification = 'shai' | 'partner' | 'community'
export type ExtensionStatus = 'active' | 'deleted'

export type Extension = {
  id: string
  name: string
  organization: string
  category: ExtensionCategory
  type: ExtensionType
  icon?: string | null
  label: I18nField
  brief: I18nField
  introduction?: I18nField
  versions?: ExtensionStorage[]
  install_count?: number
  plugin_id: string
}

export type OffsetPagination<T> = {
  items: T[]
  limit: number
  offset: number
  total: number
}

export type ExtensionStorage = {
  id: string
  created_at: string
  updated_at: string
  semver_major: number
  semver_minor: number
  semver_patch: number
  version: string
  hash: string
  identifier: string
  extension_id: string
}

export type ListExtensionsQuery = {
  sort_by?: 'label' | null
  sort_order?: 'asc' | 'desc' | null
  label?: string | null
  name?: string | null
  organization?: string | null
  category?: ExtensionCategory | null
  extension_type?: ExtensionType | null
  verification?: ExtensionVerification | null
  status?: ExtensionStatus | null
  collection_name_in?: string[] | null
  page?: number
  size?: number
}

export const listExtensions = (params: ListExtensionsQuery) => {
  return getShaiMarketplace<OffsetPagination<Extension>>('/extension', { params })
}

export const getExtension = (extensionId: string) => {
  return getShaiMarketplace<Extension>(`/extension/${extensionId}`)
}
