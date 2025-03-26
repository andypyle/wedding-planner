import { createClient } from '@/lib/supabase/client'
import { Guest } from '@/types/guest'

export async function getGuests(): Promise<Guest[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .order('first_name')
    .order('last_name')

  if (error) {
    console.error('Error fetching guests:', error)
    return []
  }

  return data || []
}

export async function deleteGuest(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('guests').delete().eq('id', id)

  if (error) {
    console.error('Error deleting guest:', error)
    throw error
  }
}

export async function updateGuest(guest: Guest): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('guests')
    .update(guest)
    .eq('id', guest.id)

  if (error) {
    console.error('Error updating guest:', error)
    throw error
  }
}

export async function createGuest(
  guest: Omit<Guest, 'id' | 'created_at' | 'updated_at'>
): Promise<Guest> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('guests')
    .insert([guest])
    .select()
    .single()

  if (error) {
    console.error('Error creating guest:', error)
    throw error
  }

  return data
}
