export type GuestStatus = 'pending' | 'attending' | 'not_attending'

export interface Guest {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  group: string
  rsvp_status: GuestStatus
  dietary_restrictions?: string
  plus_one: boolean
  created_at: string
  updated_at: string
}
