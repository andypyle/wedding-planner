import { Vendor } from '@/types/vendor'
import { NewVendorData } from '../VendorForm/types'

export interface AddVendorModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (vendor: NewVendorData) => void
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
