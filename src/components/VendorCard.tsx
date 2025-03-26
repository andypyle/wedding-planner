import { useState } from 'react'
import { Vendor } from '../types/vendor'

interface VendorCardProps {
  vendor: Vendor
  onEdit: (vendor: Vendor) => void
  onDelete: (id: string) => void
}

export const VendorCard = ({ vendor, onEdit, onDelete }: VendorCardProps) => {
  const [showPaymentDetails, setShowPaymentDetails] = useState(false)
  const totalPaid = vendor.payments.reduce((sum, p) => sum + p.amount, 0)
  const paymentPercentage =
    vendor.price > 0 ? Math.round((totalPaid / vendor.price) * 100) : 0

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-earth-800">
            {vendor.name}
          </h3>
          <span className="inline-block px-2 py-1 text-sm rounded-full bg-accent/20 text-earth-800 mt-1">
            {vendor.category}
          </span>
        </div>
        <span className="inline-block px-3 py-1 text-sm rounded-full bg-primary/20 text-earth-800">
          {vendor.status}
        </span>
      </div>

      <div className="space-y-2 text-sm text-earth-600">
        <p>
          <span className="font-medium">Contact:</span> {vendor.contact_name}
        </p>
        <p>
          <span className="font-medium">Email:</span> {vendor.contact_email}
        </p>
        <p>
          <span className="font-medium">Phone:</span> {vendor.contact_phone}
        </p>
      </div>

      <div className="mt-4 p-3 bg-earth-100 rounded-md space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <p className="font-medium text-earth-800">Payment Details:</p>
          {vendor.payments.length > 0 && (
            <button
              onClick={() => setShowPaymentDetails(!showPaymentDetails)}
              className="text-primary text-xs hover:underline">
              {showPaymentDetails ? 'Hide Details' : 'Show Details'}
            </button>
          )}
        </div>

        <div className="flex justify-between text-sm mb-2">
          <span>Total Price: ${vendor.price.toLocaleString()}</span>
          <span>
            Paid: ${totalPaid.toLocaleString()} ({paymentPercentage}%)
          </span>
        </div>

        <div className="w-full bg-earth-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full"
            style={{ width: `${paymentPercentage}%` }}></div>
        </div>

        <p
          className={`text-right mt-2 font-medium ${
            vendor.remaining_balance > 0 ? 'text-earth-800' : 'text-green-600'
          }`}>
          Remaining: ${vendor.remaining_balance.toLocaleString()}
        </p>

        {showPaymentDetails && vendor.payments.length > 0 && (
          <div className="mt-3 pt-3 border-t border-earth-300">
            <p className="font-medium mb-2">Payment History:</p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-earth-200 text-xs">
                <thead className="bg-earth-50">
                  <tr>
                    <th className="px-2 py-1 text-left font-medium text-earth-600">
                      Date
                    </th>
                    <th className="px-2 py-1 text-left font-medium text-earth-600">
                      Amount
                    </th>
                    <th className="px-2 py-1 text-left font-medium text-earth-600">
                      Method
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-earth-200">
                  {vendor.payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-2 py-1 whitespace-nowrap">
                        {payment.date}
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap">
                        ${payment.amount.toLocaleString()}
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap">
                        {payment.method}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {vendor.notes && (
        <p className="mt-4 text-sm text-earth-600">
          <span className="font-medium">Notes:</span> {vendor.notes}
        </p>
      )}

      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-earth-200">
        <button
          onClick={() => onEdit(vendor)}
          className="btn-secondary text-sm">
          Edit
        </button>
        <button
          onClick={() => onDelete(vendor.id)}
          className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          Delete
        </button>
      </div>
    </div>
  )
}
