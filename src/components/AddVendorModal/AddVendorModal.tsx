'use client'

import { Modal } from '@/components/Modal/Modal'
import { VendorForm } from '@/components/VendorForm'
import { AddVendorModalProps } from './types'

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
