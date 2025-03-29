import { TimelineEvent } from '@/types/timeline'

export interface TimelineListProps {
  events: TimelineEvent[]
  onEdit: (event: TimelineEvent) => void
  onDelete: (id: string) => void
}
