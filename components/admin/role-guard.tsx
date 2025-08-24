"use client"

import type React from "react"
import { useAuth } from "@/components/auth-provider"
import { hasPermission, canAccessAdmin } from "@/lib/permissions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldX } from "lucide-react"

interface RoleGuardProps {
  children: React.ReactNode
  requiredPermission?: "create" | "read" | "update" | "delete"
  requireAuth?: boolean
  fallback?: React.ReactNode
}

export function RoleGuard({ children, requiredPermission, requireAuth = false, fallback }: RoleGuardProps) {
  const { user } = useAuth()

  if (requireAuth && !canAccessAdmin(user)) {
    return (
      fallback || (
        <Alert variant="destructive">
          <ShieldX className="h-4 w-4" />
          <AlertDescription>You need to be logged in to access this feature.</AlertDescription>
        </Alert>
      )
    )
  }

  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    return (
      fallback || (
        <Alert variant="destructive">
          <ShieldX className="h-4 w-4" />
          <AlertDescription>You don't have permission to perform this action.</AlertDescription>
        </Alert>
      )
    )
  }

  return <>{children}</>
}
