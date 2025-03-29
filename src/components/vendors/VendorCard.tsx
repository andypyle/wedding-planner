'use client'

import { VendorCardProps } from './types'

export function VendorCard({ vendor, onEdit, onDelete }: VendorCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-base font-medium text-gray-900">{vendor.name}</h3>
          {vendor.category && (
            <p className="mt-1 text-sm text-gray-500">{vendor.category}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              vendor.status === 'Booked'
                ? 'bg-green-100 text-green-800'
                : vendor.status === 'Contacted'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
            {vendor.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 text-sm">
        <div>
          <span className="text-gray-600">Contact</span>
          <p className="font-medium text-gray-900">{vendor.contact_name}</p>
          <p className="font-medium text-gray-900">{vendor.contact_email}</p>
          <p className="font-medium text-gray-900">{vendor.contact_phone}</p>
        </div>
        <div>
          <span className="text-gray-600">Price</span>
          <p className="font-medium text-gray-900">
            ${vendor.price.toLocaleString()}
          </p>
        </div>
        {vendor.notes && (
          <div>
            <span className="text-gray-600">Notes</span>
            <p className="font-medium text-gray-900">{vendor.notes}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onEdit(vendor)}
          className="text-sm text-gray-600 hover:text-gray-900">
          Edit
        </button>
        <button
          onClick={() => onDelete(vendor.id)}
          className="text-sm text-red-600 hover:text-red-900">
          Delete
        </button>
      </div>
    </div>
  )
}
