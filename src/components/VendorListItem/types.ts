import { Vendor } from '@/types/vendor'

export interface VendorListItemProps {
  vendor: Vendor
  onEdit: () => void
  onDelete: () => void
}
