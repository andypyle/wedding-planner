import { Guest } from '@/types/guest'
import { Vendor } from '@/types/vendor'

export interface DashboardClientProps {
  vendors: Vendor[]
  guests: Guest[]
  daysUntilWedding: number | null
}

export interface ChecklistStats {
  total: number
  completed: number
  upcoming: number
  categories: {
    [key: string]: {
      total: number
      completed: number
    }
  }
}

export interface BudgetOverviewProps {
  vendors: Vendor[]
}

export interface GuestOverviewProps {
  guests: Guest[]
}
