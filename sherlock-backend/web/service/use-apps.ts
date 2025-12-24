import { get, post } from './base'
import type { App } from '@/types/app'
import type { AppListResponse } from '@/models/app'
import { useInvalid } from './use-base'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { GeneratorType } from '@/app/components/app/configuration/config/automatic/types'

const NAME_SPACE = 'apps'

// TODO paging for list
const useAppFullListKey = [NAME_SPACE, 'full-list']
export const useAppFullList = () => {
  return useQuery<AppListResponse>({
    queryKey: useAppFullListKey,
    queryFn: () => get<AppListResponse>('/apps', { params: { page: 1, limit: 100 } }),
  })
}

export const useInvalidateAppFullList = () => {
  return useInvalid(useAppFullListKey)
}

export const useAppDetail = (appID: string) => {
  return useQuery<App>({
    queryKey: [NAME_SPACE, 'detail', appID],
    queryFn: () => get<App>(`/apps/${appID}`),
  })
}

export const useGenerateRuleTemplate = (type: GeneratorType, disabled?: boolean) => {
  return useQuery({
    queryKey: [NAME_SPACE, 'generate-rule-template', type],
    queryFn: () => post<{ data: string }>('instruction-generate/template', {
      body: {
        type,
      },
    }),
    enabled: !disabled,
    retry: 0,
  })
}

export type AppAccessMode = 'only_me' | 'all_team_members' | 'partial_members'
export type AppAccessResponse = { access: AppAccessMode }
export const useAppAccess = (appID?: string, enabled = true) => {
  return useQuery<AppAccessResponse>({
    queryKey: [NAME_SPACE, 'access', appID],
    queryFn: () => get<AppAccessResponse>(`/apps/${appID}/access`),
    enabled: !!appID && enabled,
  })
}

export const useAppMembers = (appID?: string, enabled = true) => {
  return useQuery({
    queryKey: [NAME_SPACE, 'members', appID],
    queryFn: () => get(`/apps/${appID}/members`),
    enabled: !!appID && enabled,
  })
}

export const useUpdateAppMembers = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [NAME_SPACE, 'update-members'],
    mutationFn: ({ appID, accountIds }: { appID: string; accountIds: string[] }) =>
      post(`/apps/${appID}/members/add_many`, { body: { account_ids: accountIds } }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [NAME_SPACE, 'members', variables.appID] })
    },
  })
}

export const useUpdateAppAccessMode = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [NAME_SPACE, 'update-access-mode'],
    mutationFn: ({ appID, accessType }: { appID: string; accessType: AppAccessMode }) =>
      post(`/apps/${appID}/access`, { body: { access_type: accessType } }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [NAME_SPACE, 'access', variables.appID] })
    },
  })
}
