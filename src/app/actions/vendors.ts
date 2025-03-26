'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function getVendors() {
  const supabase = createServerActionClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data: vendors, error } = await supabase
    .from('vendors')
    .select('*, payments(*)')
    .eq('user_id', user.id)
    .order('name')

  if (error) {
    console.error('Error fetching vendors:', error)
    return []
  }

  return vendors
}

export async function getVendor(id: string) {
  const supabase = createServerActionClient({ cookies })

  const { data: vendor, error } = await supabase
    .from('vendors')
    .select('*, payments(*)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching vendor:', error)
    return null
  }

  return vendor
}

export async function createVendor(formData: FormData) {
  const supabase = createServerActionClient({ cookies })

  // Extract vendor data from form
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const contactName = formData.get('contactName') as string
  const contactEmail = formData.get('contactEmail') as string
  const contactPhone = formData.get('contactPhone') as string
  const price = parseFloat(formData.get('price') as string) || 0
  const notes = formData.get('notes') as string
  const status = formData.get('status') as string

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Create vendor
  const { data: vendor, error } = await supabase
    .from('vendors')
    .insert({
      name,
      category,
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      price,
      notes,
      status,
      remaining_balance: price,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating vendor:', error)
    return { error: error.message }
  }

  revalidatePath('/vendors')
  return { vendor }
}

export async function updateVendor(id: string, formData: FormData) {
  const supabase = createServerActionClient({ cookies })

  // Extract vendor data from form
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const contactName = formData.get('contactName') as string
  const contactEmail = formData.get('contactEmail') as string
  const contactPhone = formData.get('contactPhone') as string
  const price = parseFloat(formData.get('price') as string) || 0
  const notes = formData.get('notes') as string
  const status = formData.get('status') as string

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get current vendor to update remaining balance correctly
  const { data: currentVendor } = await supabase
    .from('vendors')
    .select('remaining_balance, price')
    .eq('id', id)
    .single()

  const { data: payments } = await supabase
    .from('payments')
    .select('amount')
    .eq('vendor_id', id)

  // Calculate total payments
  const totalPaid =
    payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0

  // Calculate new remaining balance if price changed
  const remainingBalance = price - totalPaid

  // Update vendor
  const { data: vendor, error } = await supabase
    .from('vendors')
    .update({
      name,
      category,
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      price,
      notes,
      status,
      remaining_balance: remainingBalance,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating vendor:', error)
    return { error: error.message }
  }

  revalidatePath('/vendors')
  revalidatePath(`/vendors/${id}`)
  return { vendor }
}

export async function deleteVendor(id: string) {
  const supabase = createServerActionClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Delete payments first (maintain referential integrity)
  await supabase.from('payments').delete().eq('vendor_id', id)

  // Delete vendor
  const { error } = await supabase
    .from('vendors')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting vendor:', error)
    return { error: error.message }
  }

  revalidatePath('/vendors')
  return { success: true }
}

export async function addPayment(vendorId: string, formData: FormData) {
  const supabase = createServerActionClient({ cookies })

  // Extract payment data from form
  const amount = parseFloat(formData.get('amount') as string) || 0
  const date = formData.get('date') as string
  const method = formData.get('method') as string
  const notes = formData.get('notes') as string

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Verify vendor belongs to user
  const { data: vendor } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', vendorId)
    .eq('user_id', user.id)
    .single()

  if (!vendor) {
    return { error: 'Vendor not found or unauthorized' }
  }

  // Add payment
  const { data: payment, error } = await supabase
    .from('payments')
    .insert({
      vendor_id: vendorId,
      amount,
      date,
      method,
      notes,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding payment:', error)
    return { error: error.message }
  }

  // Update vendor remaining balance and status
  const newRemainingBalance = vendor.remaining_balance - amount
  let newStatus = vendor.status

  if (newRemainingBalance <= 0) {
    newStatus = 'Paid in Full'
  } else if (
    vendor.status === 'Booked' ||
    vendor.status === 'Contacted' ||
    vendor.status === 'Meeting Scheduled'
  ) {
    newStatus = 'Deposit Paid'
  }

  await supabase
    .from('vendors')
    .update({
      remaining_balance: newRemainingBalance,
      status: newStatus,
    })
    .eq('id', vendorId)

  revalidatePath('/vendors')
  revalidatePath(`/vendors/${vendorId}`)
  return { payment }
}

export async function deletePayment(paymentId: string, vendorId: string) {
  const supabase = createServerActionClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get payment amount to update vendor
  const { data: payment } = await supabase
    .from('payments')
    .select('amount')
    .eq('id', paymentId)
    .single()

  if (!payment) {
    return { error: 'Payment not found' }
  }

  // Get vendor to update remaining balance
  const { data: vendor } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', vendorId)
    .eq('user_id', user.id)
    .single()

  if (!vendor) {
    return { error: 'Vendor not found or unauthorized' }
  }

  // Delete payment
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', paymentId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting payment:', error)
    return { error: error.message }
  }

  // Update vendor remaining balance and status
  const newRemainingBalance = vendor.remaining_balance + payment.amount
  let newStatus = vendor.status

  if (vendor.status === 'Paid in Full' && newRemainingBalance > 0) {
    newStatus = 'Deposit Paid'
  } else if (vendor.status === 'Deposit Paid' && vendor.payments.length <= 1) {
    // If this was the only payment
    newStatus = 'Booked'
  }

  await supabase
    .from('vendors')
    .update({
      remaining_balance: newRemainingBalance,
      status: newStatus,
    })
    .eq('id', vendorId)

  revalidatePath('/vendors')
  revalidatePath(`/vendors/${vendorId}`)
  return { success: true }
}
