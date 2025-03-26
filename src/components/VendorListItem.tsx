'use client'

import { Vendor } from '@/types/vendor'
import Link from 'next/link'
import { useState } from 'react'

interface VendorListItemProps {
  vendor: Vendor
  deleteVendor: (id: string) => Promise<{ error?: string; success?: boolean }>
}

export default function VendorListItem({
  vendor,
  deleteVendor,
}: VendorListItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  // Calculate total payments
  const totalPaid =
    vendor.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0
  const paymentCount = vendor.payments?.length || 0

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${vendor.name}?`)) {
      setIsDeleting(true)
      try {
        const result = await deleteVendor(vendor.id)
        if (result.error) {
          alert(`Error: ${result.error}`)
          setIsDeleting(false)
        }
      } catch (error) {
        console.error('Error deleting vendor:', error)
        alert('An error occurred while deleting the vendor')
        setIsDeleting(false)
      }
    }
  }

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <Link
          href={`/vendors/${vendor.id}`}
          className="text-primary hover:text-primary-dark">
          {vendor.name}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 py-1 text-xs rounded-full bg-earth-100 text-earth-800">
          {vendor.category}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        ${vendor.price.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        ${totalPaid.toLocaleString()}
        {paymentCount > 0 && (
          <span className="ml-1 text-xs text-earth-500">
            ({paymentCount} payment{paymentCount !== 1 ? 's' : ''})
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        ${vendor.remaining_balance.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
            vendor.status
          )}`}>
          {vendor.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end space-x-2">
          <Link
            href={`/vendors/${vendor.id}/edit`}
            className="text-sm p-2 hover:bg-earth-100 rounded-full text-earth-600 hover:text-earth-900">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-sm p-2 hover:bg-red-100 rounded-full text-red-500 hover:text-red-700 disabled:opacity-50">
            {isDeleting ? (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            )}
          </button>
        </div>
      </td>
    </tr>
  )
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'Contacted':
      return 'bg-yellow-100 text-yellow-800'
    case 'Meeting Scheduled':
      return 'bg-blue-100 text-blue-800'
    case 'Booked':
      return 'bg-purple-100 text-purple-800'
    case 'Deposit Paid':
      return 'bg-indigo-100 text-indigo-800'
    case 'Paid in Full':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
