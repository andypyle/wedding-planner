import { Vendor } from '@/types/vendor'

export interface EditVendorModalProps {
  vendor: Vendor | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (
    vendor: Omit<Vendor, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => void
  onAddPayment: (
    payment: Omit<
      Vendor['payments'][0],
      'id' | 'vendor_id' | 'user_id' | 'created_at' | 'updated_at'
    >
  ) => void
  onDeletePayment: (paymentId: string) => void
  isSubmitting?: boolean
  isAddingPayment?: boolean
  isDeletingPayment?: boolean
}
