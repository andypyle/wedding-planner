import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  try {
    const [vendorsResponse, guestsResponse, checklistResponse] =
      await Promise.all([
        supabase
          .from('vendors')
          .select('*, payments(*)')
          .eq('user_id', user.id),
        supabase.from('guests').select('*').eq('user_id', user.id),
        supabase.from('checklist_items').select('*').eq('user_id', user.id),
      ])

    if (vendorsResponse.error) {
      throw vendorsResponse.error
    }

    if (guestsResponse.error) {
      throw guestsResponse.error
    }

    if (checklistResponse.error) {
      throw checklistResponse.error
    }

    const vendors = vendorsResponse.data
    const guests = guestsResponse.data
    const checklistItems = checklistResponse.data

    // Get wedding date from profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('wedding_date')
      .eq('id', user.id)
      .single()

    // If profile error is not found, we can continue with null wedding date
    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError
    }

    const weddingDate = profileData?.wedding_date
      ? new Date(profileData.wedding_date)
      : null

    return (
      <DashboardClient
        vendors={vendors}
        guests={guests}
        checklistItems={checklistItems}
        weddingDate={weddingDate}
      />
    )
  } catch (error) {
    console.error('Error loading dashboard:', error)
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
          Error Loading Dashboard
        </h2>
        <p className="text-slate-600">
          There was an error loading your dashboard. Please try again later.
        </p>
      </div>
    )
  }
}
