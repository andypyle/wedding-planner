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

export type Priority = 'Low' | 'Medium' | 'High'

export interface TimelineEvent {
  id: string
  title: string
  description: string
  start_time: string
  end_time: string | null
  location: string | null
  vendor_name: string | null
  vendor_contact: string | null
  notes: string | null
  created_at: string
  updated_at: string
  user_id: string
}
