'use client'

import { updateVendor } from '@/app/vendors/actions'
import { AddVendorModal } from '@/components/AddVendorModal'
import { ConfirmDialog } from '@/components/ConfirmDialog/ConfirmDialog'
import { EditVendorModal } from '@/components/EditVendorModal'
import { VendorCard } from '@/components/VendorCard'
import { NewVendorData } from '@/components/VendorForm/types'
import { useWindowSize } from '@/hooks/useWindowSize'
import { createClient } from '@/lib/supabase/client'
import { Vendor } from '@/types/vendor'
import { useEffect, useState } from 'react'

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const [isDeletingPayment, setIsDeletingPayment] = useState(false)
  const [vendorToDelete, setVendorToDelete] = useState<string | null>(null)
  const [isDeletingVendor, setIsDeletingVendor] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { width } = useWindowSize()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    // Default to grid on mobile, list on desktop
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 'grid' : 'list'
    }
    return 'list'
  })

  // Update view mode when window size changes
  useEffect(() => {
    if (width) {
      setViewMode(width < 768 ? 'grid' : 'list')
    }
  }, [width])

  const supabase = createClient()

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    const { data, error } = await supabase
      .from('vendors')
      .select(
        `
        *,
        payments (
          id,
          amount,
          date,
          method,
          notes
        )
      `
      )
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching vendors:', error)
      return
    }

    setVendors(data)
  }

  const handleAddVendor = async (
    vendor: Omit<
      Vendor,
      | 'id'
      | 'user_id'
      | 'created_at'
      | 'updated_at'
      | 'remaining_balance'
      | 'payments'
    >
  ) => {
    setIsSubmitting(true)
    try {
      // Get the current user's ID
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      // Calculate initial remaining balance
      const remaining_balance = vendor.price

      // Log the vendor data we're trying to insert
      const newVendor = {
        ...vendor,
        user_id: user.id,
        remaining_balance,
      }
      console.log('Attempting to insert vendor:', newVendor)

      const { data, error } = await supabase
        .from('vendors')
        .insert([newVendor])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from insert')
      }

      setVendors((prev) => [data[0], ...prev])
      setIsAddModalOpen(false)
    } catch (error) {
      console.error('Error adding vendor:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        vendor,
      })
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateVendor = async (vendor: NewVendorData) => {
    if (!editingVendor) return

    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('name', vendor.name)
      formData.append('category', vendor.category)
      formData.append('contactName', vendor.contact_name || '')
      formData.append('contactEmail', vendor.contact_email || '')
      formData.append('contactPhone', vendor.contact_phone || '')
      formData.append('price', vendor.price.toString())
      formData.append('notes', vendor.notes || '')
      formData.append('status', vendor.status)

      const result = await updateVendor(editingVendor.id, formData)

      if (result.error) {
        setError(result.error)
        return
      }

      // Calculate new remaining balance
      const totalPaid = (editingVendor.payments ?? []).reduce(
        (sum: number, p: { amount: number }) => sum + p.amount,
        0
      )
      const remaining_balance = vendor.price - totalPaid

      setVendors((prevVendors) =>
        prevVendors.map((v) =>
          v.id === editingVendor.id
            ? {
                ...v,
                ...vendor,
                remaining_balance,
              }
            : v
        )
      )

      setEditingVendor(null)
    } catch (err) {
      console.error('Error updating vendor:', err)
      setError('Failed to update vendor')
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
    if (!editingVendor) return

    setIsAddingPayment(true)
    try {
      // Get the current user's ID
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      console.log('Adding payment:', {
        payment,
        vendor_id: editingVendor.id,
        user_id: user.id,
      })

      // First, insert the payment
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .insert([
          {
            ...payment,
            vendor_id: editingVendor.id,
            user_id: user.id,
          },
        ])
        .select()

      if (paymentError) {
        console.error('Payment insert error:', paymentError)
        throw paymentError
      }

      if (!paymentData || paymentData.length === 0) {
        throw new Error('No payment data returned from insert')
      }

      console.log('Payment added successfully:', paymentData[0])

      // Fetch the updated vendor data with all payments
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendors')
        .select(
          `
          *,
          payments (
            id,
            amount,
            date,
            method,
            notes
          )
        `
        )
        .eq('id', editingVendor.id)
        .single()

      if (vendorError) {
        console.error('Error fetching updated vendor:', vendorError)
        throw vendorError
      }

      if (!vendorData) {
        throw new Error('No vendor data returned')
      }

      // Calculate new remaining balance
      const totalPaid = (vendorData.payments ?? []).reduce(
        (sum: number, p: { amount: number }) => sum + p.amount,
        0
      )
      const remaining_balance = vendorData.price - totalPaid

      // Update the vendor with new remaining balance
      const { data: updatedVendorData, error: updateError } = await supabase
        .from('vendors')
        .update({ remaining_balance })
        .eq('id', editingVendor.id)
        .select(
          `
          *,
          payments (
            id,
            amount,
            date,
            method,
            notes
          )
        `
        )
        .single()

      if (updateError) {
        console.error('Error updating vendor balance:', updateError)
        throw updateError
      }

      if (!updatedVendorData) {
        throw new Error('No updated vendor data returned')
      }

      console.log('Vendor updated successfully:', updatedVendorData)

      // Update both the editing vendor and the vendors list
      setEditingVendor(updatedVendorData)
      setVendors((prev) =>
        prev.map((v) => (v.id === editingVendor.id ? updatedVendorData : v))
      )
    } catch (error) {
      console.error('Error adding payment:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        payment,
        vendor: editingVendor,
      })
      throw error
    } finally {
      setIsAddingPayment(false)
    }
  }

  const handleDeletePayment = async (paymentId: string) => {
    if (!editingVendor) return

    setIsDeletingPayment(true)
    try {
      const payment = editingVendor.payments.find((p) => p.id === paymentId)
      if (!payment) return

      // First delete the payment
      const { error: deleteError } = await supabase
        .from('payments')
        .delete()
        .eq('id', paymentId)

      if (deleteError) throw deleteError

      // Calculate new remaining balance
      const newPayments = editingVendor.payments.filter(
        (p) => p.id !== paymentId
      )
      const totalPaid = newPayments.reduce((sum, p) => sum + p.amount, 0)
      const remaining_balance = editingVendor.price - totalPaid

      // Update the vendor with new remaining balance
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendors')
        .update({ remaining_balance })
        .eq('id', editingVendor.id)
        .select()

      if (vendorError) throw vendorError

      // Update both the editing vendor and the vendors list
      const updatedVendor = {
        ...editingVendor,
        remaining_balance,
        payments: newPayments,
      }
      setEditingVendor(updatedVendor)
      setVendors((prev) =>
        prev.map((v) => (v.id === editingVendor.id ? updatedVendor : v))
      )
    } catch (error) {
      console.error('Error deleting payment:', error)
    } finally {
      setIsDeletingPayment(false)
    }
  }

  const handleDeleteVendorClick = (vendorId: string) => {
    setVendorToDelete(vendorId)
  }

  const handleConfirmDeleteVendor = async () => {
    if (!vendorToDelete) return

    setIsDeletingVendor(true)
    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', vendorToDelete)
      if (error) throw error
      setVendors((prev) => prev.filter((v) => v.id !== vendorToDelete))
      setVendorToDelete(null)
    } catch (error) {
      console.error('Error deleting vendor:', error)
    } finally {
      setIsDeletingVendor(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Vendors</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage your wedding vendors
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-l-md border ${
                viewMode === 'grid'
                  ? 'bg-slate-600 text-white border-slate-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}>
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-r-md border ${
                viewMode === 'list'
                  ? 'bg-slate-600 text-white border-slate-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}>
              List
            </button>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200">
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Add Vendor
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onEdit={() => setEditingVendor(vendor)}
              onDelete={() => handleDeleteVendorClick(vendor.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Remaining
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {vendors.map((vendor) => {
                  const totalPaid = (vendor.payments ?? []).reduce(
                    (sum: number, p: { amount: number }) => sum + p.amount,
                    0
                  )
                  const remainingBalance = vendor.price - totalPaid
                  return (
                    <tr key={vendor.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-800">
                          {vendor.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {vendor.contact_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
                          {vendor.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        ${vendor.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        ${totalPaid.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        ${remainingBalance.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
                          {vendor.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setEditingVendor(vendor)}
                          className="text-slate-600 hover:text-slate-800 mr-4">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteVendorClick(vendor.id)}
                          className="text-slate-600 hover:text-slate-800">
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AddVendorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddVendor}
        onAddPayment={handleAddPayment}
        onDeletePayment={handleDeletePayment}
        isSubmitting={isSubmitting}
        isAddingPayment={isAddingPayment}
        isDeletingPayment={isDeletingPayment}
      />

      <EditVendorModal
        vendor={editingVendor}
        isOpen={!!editingVendor}
        onClose={() => setEditingVendor(null)}
        onSubmit={handleUpdateVendor}
        onAddPayment={handleAddPayment}
        onDeletePayment={handleDeletePayment}
        isSubmitting={isSubmitting}
        isAddingPayment={isAddingPayment}
        isDeletingPayment={isDeletingPayment}
      />

      <ConfirmDialog
        isOpen={!!vendorToDelete}
        onClose={() => setVendorToDelete(null)}
        onConfirm={handleConfirmDeleteVendor}
        title="Delete Vendor"
        message="Are you sure you want to delete this vendor? This will also delete all associated payments and cannot be undone."
        isLoading={isDeletingVendor}
      />
    </div>
  )
}
