export type TimelineStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Completed'
  | 'Overdue'
export type TimelineCategory =
  | 'Venue'
  | 'Catering'
  | 'Decor'
  | 'Attire'
  | 'Photography'
  | 'Music'
  | 'Ceremony'
  | 'Reception'
  | 'Other'

export interface TimelineEvent {
  id: string
  title: string
  description?: string
  category: TimelineCategory
  status: TimelineStatus
  dueDate: string
  completedDate?: string
  assignedTo?: string[]
  notes?: string
  priority: 'Low' | 'Medium' | 'High'
  dependencies?: string[] // IDs of events that must be completed before this one
}
