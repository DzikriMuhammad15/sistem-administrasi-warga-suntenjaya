import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { cache } from "react"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lcbzjkjozihjkeudifiq.supabase.co"
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYnpqa2pvemloamtldWRpZmlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2OTc0NTgsImV4cCI6MjA3MTI3MzQ1OH0.AMyDU4josA6Zwwr1K3J1EEPYa4zKkJURZhfOodCC7CI"

// Check if Supabase configuration is available
export const isSupabaseConfigured = !!SUPABASE_URL && !!SUPABASE_ANON_KEY

// Create a cached version of the Supabase client for Server Components
export const createClient = cache(async () => {
  const cookieStore = await cookies()

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
})
