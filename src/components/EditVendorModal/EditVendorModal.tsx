'use client'

import { Modal } from '@/components/modal'
import { VendorForm } from '@/components/VendorForm'
import { EditVendorModalProps } from './types'

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
