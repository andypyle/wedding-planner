import { Guest, GuestStatus } from '@/types/guest'

export interface GuestFormProps {
  guest?: Guest
  onSubmit: (
    guestData: Omit<Guest, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export interface GuestFormData
  extends Omit<Guest, 'id' | 'user_id' | 'created_at' | 'updated_at'> {
  first_name: string
  last_name: string
  email: string
  phone: string
  group_name: string
  rsvp_status: GuestStatus
  plus_one: boolean
  dietary_restrictions: string
  address: string
  city: string
  state: string
  zip: string
  meal_choice: string
  plus_one_name: string
  plus_one_meal_choice: string
  notes: string
}

export const GUEST_STATUSES: GuestStatus[] = [
  'pending',
  'attending',
  'not_attending',
] as const

export const GUEST_GROUPS = [
  'Family',
  'Close Friends',
  'Friends',
  'Colleagues',
  'Other',
] as const
