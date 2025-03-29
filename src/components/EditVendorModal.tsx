import { Vendor } from '@/types/vendor'
import { Modal } from './Modal'
import { VendorForm } from './vendors/VendorForm'

interface EditVendorModalProps {
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

export function EditVendorModal({
  vendor,
  isOpen,
  onClose,
  onSubmit,
  onAddPayment,
  onDeletePayment,
  isSubmitting,
  isAddingPayment,
  isDeletingPayment,
}: EditVendorModalProps) {
  if (!vendor) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Vendor">
      <VendorForm
        vendor={vendor}
        onSubmit={onSubmit}
        onCancel={onClose}
        onAddPayment={onAddPayment}
        onDeletePayment={onDeletePayment}
        isSubmitting={isSubmitting}
        isAddingPayment={isAddingPayment}
        isDeletingPayment={isDeletingPayment}
      />
    </Modal>
  )
}
