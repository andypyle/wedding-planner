import { Vendor } from '@/types/vendor'

export interface VendorCardProps {
  vendor: Vendor
  onEdit: () => void
  onDelete: () => void
}
