import { User } from '@supabase/supabase-js'

export interface NavigationProps {
  user: User | null
}

export interface NavigationItem {
  name: string
  href: string
}
