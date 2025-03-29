'use client'

import { VendorListItemProps } from './types'

export function VendorListItem({
  vendor,
  onEdit,
  onDelete,
}: VendorListItemProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
        <div className="text-sm text-gray-500">{vendor.category}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{vendor.contact_name}</div>
        <div className="text-sm text-gray-500">{vendor.contact_email}</div>
        <div className="text-sm text-gray-500">{vendor.contact_phone}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          ${vendor.price.toLocaleString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            vendor.status === 'Booked'
              ? 'bg-green-100 text-green-800'
              : vendor.status === 'Deposit Paid'
              ? 'bg-blue-100 text-blue-800'
              : vendor.status === 'Paid in Full'
              ? 'bg-purple-100 text-purple-800'
              : vendor.status === 'Contacted'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
          {vendor.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onEdit(vendor)}
          className="text-gray-600 hover:text-gray-900 mr-4">
          Edit
        </button>
        <button
          onClick={() => onDelete(vendor.id)}
          className="text-red-600 hover:text-red-900">
          Delete
        </button>
      </td>
    </tr>
  )
}
