import ProfileForm from '@/components/ProfileForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    redirect('/login')
  }

  // Get the user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single()

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-semibold text-earth-800 mb-6">
        Profile Settings
      </h1>

      <div className="bg-surface rounded-lg shadow-sm border border-earth-200 overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <ProfileForm profile={profile} user={data.user} />
        </div>
      </div>
    </div>
  )
}
