import { Guest } from '@/types/guest'

export interface GuestListProps {
  guests: Guest[]
  onEdit: (guest: Guest) => void
  onDelete: (id: string) => void
}

export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  attending: 'bg-green-100 text-green-800',
  not_attending: 'bg-red-100 text-red-800',
} as const
