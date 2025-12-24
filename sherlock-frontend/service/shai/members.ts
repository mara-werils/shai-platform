import { get, put } from '../base'

export type MemberLoginLog = {
  id: string
  ip_address: string
  created_at: number
  is_successful: boolean
}

export type MemberLoginLogsResponse = {
  logs: MemberLoginLog[]
}

export const fetchMemberLoginLogs = (userId: string, period: string) => {
  return get<MemberLoginLogsResponse>(`/workspaces/current/members/${userId}/logs`, { params: { period } })
}

export const updateMemberStatus = (userId: string, status: 'active' | 'banned') => {
  return put(`/workspaces/current/members/${userId}/update-status`, { body: { status } })
}

