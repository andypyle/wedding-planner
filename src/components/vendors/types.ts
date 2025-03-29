import { Payment, Vendor } from '@/types/vendor'

export interface VendorCardProps {
  vendor: Vendor
  onEdit: (vendor: Vendor) => void
  onDelete: (id: string) => void
}

export interface VendorListItemProps {
  vendor: Vendor
  onEdit: (vendor: Vendor) => void
  onDelete: (id: string) => void
}

export interface VendorFormProps {
  vendor?: Vendor
  onSubmit: (
    vendorData: Omit<Vendor, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => void
  onCancel: () => void
  onAddPayment: (
    payment: Omit<
      Payment,
      'id' | 'vendor_id' | 'user_id' | 'created_at' | 'updated_at'
    >
  ) => void
  onDeletePayment: (paymentId: string) => void
  isSubmitting?: boolean
  isAddingPayment?: boolean
  isDeletingPayment?: boolean
}

export interface AddVendorModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export interface EditVendorModalProps {
  vendor: Vendor
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}
