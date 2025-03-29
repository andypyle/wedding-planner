import { TimelineEvent } from '@/types/timeline'

export interface TimelineEventFormData {
  title: string
  description: string
  start_time: string
  end_time: string
  location: string
  vendor_name: string
  vendor_contact: string
  notes: string
}

export interface TimelineEventFormProps {
  event: TimelineEvent | null
  onSubmit: (formData: TimelineEventFormData) => Promise<void>
  onCancel: () => void
  loading: boolean
}
