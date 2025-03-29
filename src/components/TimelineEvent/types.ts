import { TimelineEvent } from '@/types/timeline'

export interface TimelineEventProps {
  event: TimelineEvent
  onEdit: (event: TimelineEvent) => void
  onDelete: (id: string) => void
}
