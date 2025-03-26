'use server'

import {
  addPayment as addPaymentAction,
  createVendor,
  deletePayment as deletePaymentAction,
  updateVendor as updateVendorAction,
} from '@/app/actions/vendors'
import { Vendor } from '@/types/vendor'
import { redirect } from 'next/navigation'

export async function handleVendorSubmit(
  vendor: Omit<Vendor, 'id' | 'user_id' | 'created_at' | 'updated_at'>
) {
  const formData = new FormData()
  formData.append('name', vendor.name)
  formData.append('category', vendor.category)
  formData.append('contactName', vendor.contact_name || '')
  formData.append('contactEmail', vendor.contact_email || '')
  formData.append('contactPhone', vendor.contact_phone || '')
  formData.append('price', vendor.price.toString())
  formData.append('notes', vendor.notes || '')
  formData.append('status', vendor.status)

  await createVendor(formData)
  redirect('/vendors')
}

export async function updateVendor(id: string, formData: FormData) {
  const result = await updateVendorAction(id, formData)
  if (result.error) {
    return { error: result.error }
  }
  return { success: true }
}

export async function addPayment(vendorId: string, formData: FormData) {
  const result = await addPaymentAction(vendorId, formData)
  if (result.error) {
    return { error: result.error }
  }
  return { success: true }
}

export async function deletePayment(paymentId: string, vendorId: string) {
  const result = await deletePaymentAction(paymentId, vendorId)
  if (result.error) {
    return { error: result.error }
  }
  return { success: true }
}
