import { ChecklistCategory } from '@/types/checklist'

export interface ChecklistFormData {
  title: string
  description: string
  category: ChecklistCategory
  due_date: string
  notes: string
}

export interface ChecklistFormProps {
  item?: {
    id: string
    title: string
    description: string | null
    category: string
    due_date: string | null
    notes: string | null
  }
  onSubmit: (data: ChecklistFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}
