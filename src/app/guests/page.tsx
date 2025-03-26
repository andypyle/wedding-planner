import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { GuestsClient } from './GuestsClient'
import { getGuests } from './actions'

export default async function GuestsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const guests = await getGuests()

  return <GuestsClient initialGuests={guests} />
}
