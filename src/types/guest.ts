export type GuestStatus = 'pending' | 'attending' | 'not_attending'

export interface Guest {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  group_name: string
  rsvp_status: GuestStatus
  dietary_restrictions: string
  plus_one: boolean
  address: string
  city: string
  state: string
  zip: string
  meal_choice: string
  plus_one_name: string
  plus_one_meal_choice: string
  notes: string
  created_at: string
  updated_at: string
  user_id: string
}
