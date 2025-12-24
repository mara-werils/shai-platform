import PluginPageHeader from './components/Header'
import BackBar from './components/BackBar'
import LeftContent from './components/LeftContent'
import RightSidebar from './components/RightSidebar'
import { type Extension, getExtension } from '@/service/shai/marketplace'
import { getLocaleOnServer } from '@/i18n-config/server'

const PluginDetailPage = async ({ params }: { params: { pluginId: string } }) => {
  const locale = await getLocaleOnServer()
  let key: 'ru_RU' | 'kz_KZ' | 'en_US' = 'en_US'
  if (locale === 'ru-RU') key = 'ru_RU'
  else if (locale === 'kk-KZ') key = 'kz_KZ'
  const data: Extension = await getExtension(params?.pluginId)
  const name = (data.label && (data.label as any)[key]) || data.label?.en_US || data.label?.ru_RU || data.name || ''
  const version = data?.versions?.[0]?.version || ''
  const icon = data?.icon || ''
  const category = data?.category || ''
  const versionDate = data?.versions?.[0]?.created_at || ''
  const organization = data?.organization || ''
  const versions = (data.versions || []).map(v => ({ version: v.version, created_at: v.created_at, identifier: v.identifier as any }))
  const content = (data.introduction && (data.introduction as any)[key]) || data.introduction?.en_US || data.brief?.en_US || ''
  console.log('ddata', data)
  return (
    <div className='flex min-h-screen flex-col bg-background-default'>
      <BackBar />
      {/* Хедер */}
      <div className='bg-background-default'>
        <div className='w-full px-[40px] pb-16 pt-6'>
          <PluginPageHeader
            name={name}
            version={version}
            icon={icon}
            uniqueIdentifier={(data as any)?.versions?.[0]?.identifier || ''}
            org={data?.organization || ''}
            category={data?.category || ''}
            brief={(data?.brief && (data.brief as any)[key]) || data?.brief?.en_US || ''}
            pluginId={data?.plugin_id || ''}
          />
        </div>
      </div>

      {/* Контент */}
      <main className='min-h-0 flex-1'>
        <div className='min-h-full w-full bg-background-neutral-subtle px-[40px] pb-10 pt-6'>
          <div className='flex min-h-full gap-8'>
            <LeftContent content={content} />
            <RightSidebar category={category as any} version={version} versionDate={versionDate} organization={organization} versions={versions} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default PluginDetailPage
