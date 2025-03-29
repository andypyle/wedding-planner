'use client'

import { AddVendorModal } from '@/components/AddVendorModal'
import { EditVendorModal } from '@/components/EditVendorModal'
import { VendorCard } from '@/components/vendors/VendorCard'
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
    vendor: Omit<Vendor, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    setIsSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('vendors')
        .insert([vendor])
        .select()

      if (error) throw error

      setVendors((prev) => [data[0], ...prev])
      setIsAddModalOpen(false)
    } catch (error) {
      console.error('Error adding vendor:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateVendor = async (
    vendor: Omit<Vendor, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    if (!editingVendor) return

    setIsSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('vendors')
        .update(vendor)
        .eq('id', editingVendor.id)
        .select()

      if (error) throw error

      setVendors((prev) =>
        prev.map((v) => (v.id === editingVendor.id ? data[0] : v))
      )
      setEditingVendor(null)
    } catch (error) {
      console.error('Error updating vendor:', error)
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
      const { data, error } = await supabase
        .from('payments')
        .insert([{ ...payment, vendor_id: editingVendor.id }])
        .select()

      if (error) throw error

      setEditingVendor((prev) =>
        prev
          ? {
              ...prev,
              payments: [...prev.payments, data[0]],
              remaining_balance: prev.remaining_balance - payment.amount,
            }
          : null
      )
    } catch (error) {
      console.error('Error adding payment:', error)
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

      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', paymentId)

      if (error) throw error

      setEditingVendor((prev) =>
        prev
          ? {
              ...prev,
              payments: prev.payments.filter((p) => p.id !== paymentId),
              remaining_balance: prev.remaining_balance + payment.amount,
            }
          : null
      )
    } catch (error) {
      console.error('Error deleting payment:', error)
    } finally {
      setIsDeletingPayment(false)
    }
  }

  const handleDeleteVendor = async (vendorId: string) => {
    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', vendorId)
      if (error) throw error
      setVendors((prev) => prev.filter((v) => v.id !== vendorId))
    } catch (error) {
      console.error('Error deleting vendor:', error)
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onEdit={() => setEditingVendor(vendor)}
              onDelete={() => handleDeleteVendor(vendor.id)}
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
                  const totalPaid = vendor.payments.reduce(
                    (sum, p) => sum + p.amount,
                    0
                  )
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
                        ${vendor.remaining_balance.toLocaleString()}
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
                          onClick={() => handleDeleteVendor(vendor.id)}
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
    </div>
  )
}
