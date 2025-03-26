'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getGuests() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data: guests, error } = await supabase
    .from('guests')
    .select('*')
    .eq('user_id', user.id)
    .order('first_name')

  if (error) {
    throw error
  }

  return guests
}

export async function addGuest(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const guestData = {
    user_id: user.id,
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    address: formData.get('address') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    zip: formData.get('zip') as string,
    rsvp_status: formData.get('rsvp_status') as string,
    meal_choice: formData.get('meal_choice') as string,
    plus_one: formData.get('plus_one') === 'true',
    plus_one_name: formData.get('plus_one_name') as string,
    plus_one_meal_choice: formData.get('plus_one_meal_choice') as string,
    group_name: formData.get('group_name') as string,
    notes: formData.get('notes') as string,
  }

  const { error } = await supabase.from('guests').insert(guestData)

  if (error) {
    throw error
  }

  revalidatePath('/guests')
}

export async function updateGuest(id: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const guestData = {
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    address: formData.get('address') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    zip: formData.get('zip') as string,
    rsvp_status: formData.get('rsvp_status') as string,
    meal_choice: formData.get('meal_choice') as string,
    plus_one: formData.get('plus_one') === 'true',
    plus_one_name: formData.get('plus_one_name') as string,
    plus_one_meal_choice: formData.get('plus_one_meal_choice') as string,
    group_name: formData.get('group_name') as string,
    notes: formData.get('notes') as string,
  }

  const { error } = await supabase
    .from('guests')
    .update(guestData)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw error
  }

  revalidatePath('/guests')
}

export async function deleteGuest(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase
    .from('guests')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw error
  }

  revalidatePath('/guests')
}
