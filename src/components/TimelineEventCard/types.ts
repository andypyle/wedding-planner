import { TimelineEvent } from '@/types/timeline'

export interface TimelineEventCardProps {
  event: TimelineEvent
  onEdit: (event: TimelineEvent) => void
  onDelete: (id: string) => void
  formatTime: (time: string) => string
}
