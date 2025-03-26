'use client'

import { getVendors } from '@/app/actions/vendors'
import { Modal } from '@/components/Modal'
import { VendorForm } from '@/components/VendorForm'
import { Vendor } from '@/types/vendor'
import { useEffect, useState } from 'react'
import { addPayment, deletePayment, updateVendor } from './actions'

interface EditVendorModalProps {
  vendor: Vendor
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function EditVendorModal({
  vendor,
  isOpen,
  onClose,
  onSuccess,
}: EditVendorModalProps) {
  const [currentVendor, setCurrentVendor] = useState(vendor)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const [isDeletingPayment, setIsDeletingPayment] = useState(false)

  useEffect(() => {
    setCurrentVendor(vendor)
  }, [vendor])

  const refreshVendorData = async () => {
    const vendors = await getVendors()
    const updatedVendor = vendors.find((v) => v.id === vendor.id)
    if (updatedVendor) {
      setCurrentVendor(updatedVendor)
    }
  }

  const handleSubmit = async (
    updatedVendor: Omit<Vendor, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    try {
      setIsSubmitting(true)
      const formData = new FormData()
      formData.append('name', updatedVendor.name)
      formData.append('category', updatedVendor.category)
      formData.append('contactName', updatedVendor.contact_name || '')
      formData.append('contactEmail', updatedVendor.contact_email || '')
      formData.append('contactPhone', updatedVendor.contact_phone || '')
      formData.append('price', updatedVendor.price.toString())
      formData.append('notes', updatedVendor.notes || '')
      formData.append('status', updatedVendor.status)

      const result = await updateVendor(vendor.id, formData)

      if (result.error) {
        alert(`Error updating vendor: ${result.error}`)
        return
      }

      await refreshVendorData()
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error updating vendor:', error)
      alert('An error occurred while updating the vendor')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddPayment = async (
    payment: Omit<
      Vendor['payments'][0],
      'id' | 'vendor_id' | 'user_id' | 'created_at' | 'updated_at'
    >
  ) => {
    try {
      setIsAddingPayment(true)
      const formData = new FormData()
      formData.append('amount', payment.amount.toString())
      formData.append('date', payment.date)
      formData.append('method', payment.method)
      formData.append('notes', payment.notes || '')

      const result = await addPayment(vendor.id, formData)

      if (result.error) {
        alert(`Error adding payment: ${result.error}`)
        return
      }

      await refreshVendorData()
      onSuccess()
    } catch (error) {
      console.error('Error adding payment:', error)
      alert('An error occurred while adding the payment')
    } finally {
      setIsAddingPayment(false)
    }
  }

  const handleDeletePayment = async (paymentId: string) => {
    try {
      setIsDeletingPayment(true)
      const result = await deletePayment(paymentId, vendor.id)

      if (result.error) {
        alert(`Error deleting payment: ${result.error}`)
        return
      }

      await refreshVendorData()
      onSuccess()
    } catch (error) {
      console.error('Error deleting payment:', error)
      alert('An error occurred while deleting the payment')
    } finally {
      setIsDeletingPayment(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Vendor">
      <VendorForm
        vendor={currentVendor}
        onSubmit={handleSubmit}
        onCancel={onClose}
        onAddPayment={handleAddPayment}
        onDeletePayment={handleDeletePayment}
        isSubmitting={isSubmitting}
        isAddingPayment={isAddingPayment}
        isDeletingPayment={isDeletingPayment}
      />
    </Modal>
  )
}
