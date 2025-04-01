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
  profile: {
    partner1_name: string | null
    partner2_name: string | null
    wedding_date: string | null
    wedding_location: string | null
    wedding_venue: string | null
    total_budget: number | null
    avatar_url: string | null
  }
  user: any
  onSubmit: (formData: any, noRefresh?: boolean) => Promise<void>
}
