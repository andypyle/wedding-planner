import { Vendor } from '../types/vendor'
import { Modal } from './Modal'
import { VendorForm } from './VendorForm'

interface AddVendorModalProps {
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

export function AddVendorModal({
  isOpen,
  onClose,
  onSubmit,
  onAddPayment,
  onDeletePayment,
  isSubmitting,
  isAddingPayment,
  isDeletingPayment,
}: AddVendorModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Vendor">
      <VendorForm
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
