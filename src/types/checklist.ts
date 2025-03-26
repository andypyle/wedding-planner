export interface ChecklistItem {
  id: string
  title: string
  description: string | null
  category: string
  due_date: string | null
  completed: boolean
  completed_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type ChecklistCategory =
  | 'Planning'
  | 'Venue'
  | 'Vendors'
  | 'Attire'
  | 'Decor'
  | 'Food & Drink'
  | 'Entertainment'
  | 'Transportation'
  | 'Guest List'
  | 'Budget'
  | 'Other'
