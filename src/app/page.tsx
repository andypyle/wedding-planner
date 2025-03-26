import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardClient } from './DashboardClient'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    redirect('/login')
  }

  // Get vendors data
  const { data: vendors } = await supabase
    .from('vendors')
    .select('*, payments(*)')
    .eq('user_id', data.user.id)
    .order('name')

  // Get guests data
  const { data: guests } = await supabase
    .from('guests')
    .select('*')
    .eq('user_id', data.user.id)
    .order('first_name')

  // Get profile data for wedding date
  const { data: profile } = await supabase
    .from('profiles')
    .select('wedding_date')
    .eq('id', data.user.id)
    .single()

  // Calculate days until wedding
  const daysUntilWedding = profile?.wedding_date
    ? Math.ceil(
        (new Date(profile.wedding_date).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null

  return (
    <DashboardClient
      vendors={vendors || []}
      guests={guests || []}
      daysUntilWedding={daysUntilWedding}
    />
  )
}
