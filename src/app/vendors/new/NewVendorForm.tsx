'use client'

import { handleVendorSubmit } from '@/app/vendors/actions'
import { VendorForm } from '@/components/vendors/VendorForm'
import { Payment, Vendor } from '@/types/vendor'

export function NewVendorForm() {
  const handleSubmit = (
    vendor: Omit<Vendor, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    handleVendorSubmit(vendor).catch((error) => {
      console.error('Error submitting vendor:', error)
      alert('Failed to add vendor. Please try again.')
    })
  }

  const handleAddPayment = (
    payment: Omit<
      Payment,
      'id' | 'vendor_id' | 'user_id' | 'created_at' | 'updated_at'
    >
  ) => {
    // This is a no-op since we're creating a new vendor
    // Payments will be handled in the edit form
  }

  const handleDeletePayment = (paymentId: string) => {
    // This is a no-op since we're creating a new vendor
    // Payments will be handled in the edit form
  }

  return (
    <VendorForm
      onSubmit={handleSubmit}
      onCancel={() => (window.location.href = '/vendors')}
      onAddPayment={handleAddPayment}
      onDeletePayment={handleDeletePayment}
    />
  )
}
