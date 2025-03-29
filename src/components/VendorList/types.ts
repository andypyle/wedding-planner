import { Vendor } from '@/types/vendor'

export interface VendorListProps {
  vendors: Vendor[]
  onEdit: (vendor: Vendor) => void
  onDelete: (vendorId: string) => void
}
