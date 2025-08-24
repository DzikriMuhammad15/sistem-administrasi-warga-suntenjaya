import { createBrowserClient } from "@supabase/ssr"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lcbzjkjozihjkeudifiq.supabase.co"
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYnpqa2pvemloamtldWRpZmlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2OTc0NTgsImV4cCI6MjA3MTI3MzQ1OH0.AMyDU4josA6Zwwr1K3J1EEPYa4zKkJURZhfOodCC7CI"

export const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
