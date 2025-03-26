'use client'

import { deleteVendor, getVendors } from '@/app/actions/vendors'
import { createClient } from '@/lib/supabase/client'
import { Vendor } from '@/types/vendor'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { EditVendorModal } from './EditVendorModal'

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const router = useRouter()

  // Fetch vendors on component mount
  useEffect(() => {
    const fetchVendors = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push('/login')
        return
      }

      const vendors = await getVendors()
      setVendors(vendors)
    }

    fetchVendors()
  }, [router])

  const handleDelete = async (id: string) => {
    await deleteVendor(id)
    setVendors(vendors.filter((v) => v.id !== id))
  }

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor)
  }

  const handleUpdateSuccess = async () => {
    const updatedVendors = await getVendors()
    setVendors(updatedVendors)
  }

  // Sort vendors by name
  const sortedVendors = [...vendors].sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-earth-800">Vendors</h1>
          <p className="mt-1 text-sm text-earth-600">
            Manage your wedding vendors
          </p>
        </div>
        <a
          href="/vendors/new"
          className="btn btn-primary flex items-center gap-1">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Add Vendor</span>
        </a>
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-earth-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-earth-200">
            <thead className="bg-earth-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">
                  Paid
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">
                  Remaining
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-earth-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-earth-200">
              {sortedVendors.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-sm text-earth-500">
                    No vendors yet.{' '}
                    <a
                      href="/vendors/new"
                      className="text-primary hover:text-primary-dark">
                      Add your first vendor
                    </a>
                  </td>
                </tr>
              ) : (
                sortedVendors.map((vendor) => {
                  const totalPaid = vendor.payments.reduce(
                    (sum, p) => sum + p.amount,
                    0
                  )
                  return (
                    <tr key={vendor.id} className="hover:bg-earth-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-earth-800">
                          {vendor.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-earth-800">
                          {vendor.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-earth-800">
                        ${vendor.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-earth-800">
                        ${totalPaid.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-earth-800">
                        ${vendor.remaining_balance.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-earth-800">
                          {vendor.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(vendor)}
                          className="text-primary hover:text-primary-dark mr-4">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(vendor.id)}
                          className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingVendor && (
        <EditVendorModal
          vendor={editingVendor}
          isOpen={!!editingVendor}
          onClose={() => setEditingVendor(null)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  )
}
