import { TimelineEvent } from '@/types/timeline'

export interface TimelineFormData {
  title: string
  description: string
  start_time: string
  end_time: string
  location: string
  vendor_name: string
  vendor_contact: string
  notes: string
  user_id: string
}

export interface TimelineFormProps {
  event?: TimelineEvent
  onSubmit: (data: TimelineFormData) => void
  onCancel: () => void
  loading?: boolean
}
