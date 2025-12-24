'use client'

import type { FC, PropsWithChildren } from 'react'
import React from 'react'
import { useAppContext } from '@/context/app-context'
import type { WorkspaceRole } from '@/types/app'

type RequireRoleProps = PropsWithChildren<{
  include: WorkspaceRole[]
  fallback?: React.ReactNode
}>
export const RequireRole: FC<RequireRoleProps> = ({ include, fallback = null, children }) => {
  const { currentWorkspace } = useAppContext()
  return include.includes(currentWorkspace.role as Role) ? <>{children}</> : <>{fallback}</>
}

type HideForProps = PropsWithChildren<{
  roles: WorkspaceRole[]
}>
export const HideFor: FC<HideForProps> = ({ roles, children }) => {
  const { currentWorkspace } = useAppContext()
  return roles.includes(currentWorkspace.role as Role) ? null : <>{children}</>
}
