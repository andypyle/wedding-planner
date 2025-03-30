import { User } from '@supabase/supabase-js'

export interface Profile {
  id: string
  partner1_name: string
  partner2_name: string
  wedding_date: string | null
  wedding_location: string | null
  wedding_venue: string | null
  total_budget: number
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface ProfileFormProps {
  profile: Profile
  user: User
  onSubmit: (formData: any) => Promise<void>
  loading: boolean
}
