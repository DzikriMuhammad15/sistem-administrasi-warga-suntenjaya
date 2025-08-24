import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  // If Supabase is not configured, show setup message directly
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Connect Supabase to get started</h1>
      </div>
    )
  }

  // Check if user is authenticated
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const { data: userData, error } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (error || !userData) {
    // Try to create the user record with admin role by default
    const { error: insertError } = await supabase.from("users").insert({
      id: user.id,
      email: user.email || "",
      full_name: user.user_metadata?.full_name || "",
      role: "admin", // Set all new users as admin by default
    })

    if (insertError) {
      console.error("Error creating user record:", insertError)
    }
  }

  return <AdminDashboard />
}
