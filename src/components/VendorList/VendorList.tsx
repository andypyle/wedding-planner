'use client'

import { Button } from '@/components/Button/Button'
import { Modal } from '@/components/Modal/Modal'
import { Vendor, VendorCategory, VendorStatus } from '@/types/vendor'
import { useState } from 'react'
import { VendorListProps } from './types'

export function VendorList({ vendors, onEdit, onDelete }: VendorListProps) {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)

  return (
    <>
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
                        onClick={() => setSelectedVendor(vendor)}
                        className="text-slate-600 hover:text-slate-800 mr-4">
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(vendor.id)}
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

      <Modal
        isOpen={!!selectedVendor}
        onClose={() => setSelectedVendor(null)}
        title="Edit Vendor">
        {selectedVendor && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                type="text"
                value={selectedVendor.name}
                onChange={(e) =>
                  setSelectedVendor({
                    ...selectedVendor,
                    name: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Category
              </label>
              <select
                value={selectedVendor.category}
                onChange={(e) =>
                  setSelectedVendor({
                    ...selectedVendor,
                    category: e.target.value as VendorCategory,
                  })
                }
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
                <option value="Venue">Venue</option>
                <option value="Catering">Catering</option>
                <option value="Photography">Photography</option>
                <option value="Videography">Videography</option>
                <option value="Florist">Florist</option>
                <option value="Music">Music</option>
                <option value="Cake">Cake</option>
                <option value="Decor">Decor</option>
                <option value="Transportation">Transportation</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Contact Name
              </label>
              <input
                type="text"
                value={selectedVendor.contact_name}
                onChange={(e) =>
                  setSelectedVendor({
                    ...selectedVendor,
                    contact_name: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Contact Email
              </label>
              <input
                type="email"
                value={selectedVendor.contact_email}
                onChange={(e) =>
                  setSelectedVendor({
                    ...selectedVendor,
                    contact_email: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Contact Phone
              </label>
              <input
                type="tel"
                value={selectedVendor.contact_phone}
                onChange={(e) =>
                  setSelectedVendor({
                    ...selectedVendor,
                    contact_phone: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Price
              </label>
              <input
                type="number"
                value={selectedVendor.price}
                onChange={(e) =>
                  setSelectedVendor({
                    ...selectedVendor,
                    price: Number(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                value={selectedVendor.status}
                onChange={(e) =>
                  setSelectedVendor({
                    ...selectedVendor,
                    status: e.target.value as VendorStatus,
                  })
                }
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
                <option value="Contacted">Contacted</option>
                <option value="Meeting Scheduled">Meeting Scheduled</option>
                <option value="Booked">Booked</option>
                <option value="Deposit Paid">Deposit Paid</option>
                <option value="Paid in Full">Paid in Full</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Notes
              </label>
              <textarea
                value={selectedVendor.notes}
                onChange={(e) =>
                  setSelectedVendor({
                    ...selectedVendor,
                    notes: e.target.value,
                  })
                }
                rows={3}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setSelectedVendor(null)}
                className="bg-white text-slate-700 border border-slate-300 hover:bg-slate-50">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onEdit(selectedVendor)
                  setSelectedVendor(null)
                }}
                className="bg-slate-600 text-white hover:bg-slate-700">
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
