export type GuestStatus =
  | 'Not Sent'
  | 'Invited'
  | 'Confirmed'
  | 'Declined'
  | 'Maybe'

export interface Guest {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  rsvp_status: GuestStatus
  meal_choice?: string
  plus_one: boolean
  plus_one_name?: string
  plus_one_meal_choice?: string
  group_name?: string
  notes?: string
  created_at: string
  updated_at: string
}
