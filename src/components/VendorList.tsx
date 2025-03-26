'use client'

import { Vendor } from '../types/vendor'

interface VendorListProps {
  vendors: Vendor[]
  onEdit: (vendor: Vendor) => void
  onDelete: (id: string) => void
}

export function VendorList({ vendors, onEdit, onDelete }: VendorListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-earth-200">
        <thead className="bg-earth-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-earth-600 uppercase tracking-wider">
              Vendor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-earth-600 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-earth-600 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-earth-600 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-earth-600 uppercase tracking-wider">
              Paid
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-earth-600 uppercase tracking-wider">
              Remaining
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-earth-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-earth-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-earth-200">
          {vendors.map((vendor) => {
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-earth-800">
                    {vendor.contact_name}
                  </div>
                  <div className="text-sm text-earth-500">
                    {vendor.contact_email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-earth-800">
                  ${vendor.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-earth-800">
                  <div className="flex flex-col">
                    <span>${totalPaid.toLocaleString()}</span>
                    <span className="text-xs text-earth-500">
                      {vendor.payments.length} payment
                      {vendor.payments.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={
                      vendor.remaining_balance > 0
                        ? 'text-earth-800'
                        : 'text-green-600 font-medium'
                    }>
                    ${vendor.remaining_balance.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-earth-800">
                    {vendor.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(vendor)}
                      className="text-primary hover:text-primary/80">
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(vendor.id)}
                      className="text-red-500 hover:text-red-600">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
