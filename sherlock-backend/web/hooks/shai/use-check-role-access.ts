import type { ICurrentWorkspace } from '@/models/common'
import { useAppContext } from '@/context/app-context'

export type WorkspaceRole = ICurrentWorkspace['role']

// Хук для проверки доступа по роли
export const useCheckRoleAccess = () => {
  const { currentWorkspace, isLoadingCurrentWorkspace } = useAppContext()

  const checkRoleAccess = (allowedRoles: WorkspaceRole[]) => {
    return allowedRoles.includes(currentWorkspace.role)
  }

  return {
    checkRoleAccess,
    currentRole: currentWorkspace.role,
    isLoading: isLoadingCurrentWorkspace,
  }
}

