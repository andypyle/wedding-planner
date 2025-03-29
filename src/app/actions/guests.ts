import { createClient } from '@/lib/supabase/client'
import { Guest, GuestStatus } from '@/types/guest'

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
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase
    .from('guests')
    .update({
      ...guest,
      user_id: user.id,
    })
    .eq('id', guest.id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating guest:', error)
    throw error
  }
}

export async function createGuest(
  guest: Omit<Guest, 'id' | 'user_id' | 'created_at' | 'updated_at'> | FormData
): Promise<Guest> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  let guestData: Omit<Guest, 'id' | 'created_at' | 'updated_at'> & {
    user_id: string
  }

  try {
    if (guest instanceof FormData) {
      guestData = {
        user_id: user.id,
        first_name: guest.get('first_name') as string,
        last_name: guest.get('last_name') as string,
        email: guest.get('email') as string,
        phone: guest.get('phone') as string,
        group_name: (guest.get('group_name') as string) || '',
        rsvp_status: (guest.get('rsvp_status') as GuestStatus) || 'pending',
        plus_one: guest.get('plus_one') === 'true',
        dietary_restrictions:
          (guest.get('dietary_restrictions') as string) || '',
        address: '',
        city: '',
        state: '',
        zip: '',
        meal_choice: '',
        plus_one_name: '',
        plus_one_meal_choice: '',
        notes: '',
      }
    } else {
      guestData = {
        ...guest,
        user_id: user.id,
        rsvp_status: guest.rsvp_status || 'pending',
      }
    }

    console.log('Creating guest with data:', guestData)

    const { data, error } = await supabase
      .from('guests')
      .insert([guestData])
      .select()
      .single()

    if (error) {
      console.error('Error creating guest:', error)
      throw new Error(error.message || 'Failed to create guest')
    }

    if (!data) {
      throw new Error('No data returned after creating guest')
    }

    return data
  } catch (err) {
    console.error('Error in createGuest:', err)
    throw err instanceof Error ? err : new Error('Failed to create guest')
  }
}
