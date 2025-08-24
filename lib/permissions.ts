import type { User } from "@supabase/supabase-js"  // gunakan langsung dari supabase-js

export type UserRole = "user" // saat ini hanya satu role

export interface Permission {
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
}

export const USER_PERMISSIONS: Permission = {
  create: true,
  read: true,
  update: true,
  delete: true,
}

export const GUEST_PERMISSIONS: Permission = {
  create: false,
  read: true,
  update: false,
  delete: false,
}

export function hasPermission(user: User | null, action: keyof Permission): boolean {
  if (!user) {
    return GUEST_PERMISSIONS[action]
  }

  // nanti kalau ada role lain (misal admin), di sini bisa ditambahkan branching
  return USER_PERMISSIONS[action]
}

export function canAccessAdmin(user: User | null): boolean {
  return user !== null
}

export function isAuthenticated(user: User | null): boolean {
  return user !== null
}
