export type Tab = 'all' | 'model' | 'tool' | 'agent-strategy' | 'extension'
export type SortKey = 'installs' | 'rating' | 'new'

export type MarketItem = {
  id: string
  plugin_id?: string
  title: string
  vendor?: string
  installs?: number
  type?: Tab
  icon?: string
  description?: string
  category?: string
  uniqueIdentifier?: string
  organization?: string
  pluginName?: string
  version?: string
}
