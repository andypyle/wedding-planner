import { TimelineEvent } from '@/types/timeline'

export interface TimelineEventModalProps {
  event: TimelineEvent | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: {
    title: string
    description: string
    start_time: string
    end_time: string
    location: string
    vendor_name: string
    vendor_contact: string
    notes: string
  }) => Promise<void>
  loading: boolean
}
