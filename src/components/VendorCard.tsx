import { useState } from 'react'
import { Vendor } from '../types/vendor'

interface VendorCardProps {
  vendor: Vendor
  onEdit: () => void
  onDelete: () => void
}

export function VendorCard({ vendor, onEdit, onDelete }: VendorCardProps) {
  const [showPaymentDetails, setShowPaymentDetails] = useState(false)
  const totalPaid = vendor.payments.reduce((sum, p) => sum + p.amount, 0)
  const paymentPercentage =
    vendor.price > 0 ? Math.round((totalPaid / vendor.price) * 100) : 0

  return (
    <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-slate-800">{vendor.name}</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700 mt-1">
            {vendor.category}
          </span>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
          {vendor.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-slate-600">Price</span>
          <p className="font-medium text-slate-800">
            ${vendor.price.toLocaleString()}
          </p>
        </div>
        <div>
          <span className="text-slate-600">Paid</span>
          <p className="font-medium text-slate-800">
            ${totalPaid.toLocaleString()}
          </p>
        </div>
        <div>
          <span className="text-slate-600">Remaining</span>
          <p className="font-medium text-slate-800">
            ${vendor.remaining_balance.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-2 border-t border-slate-200">
        <button
          onClick={onEdit}
          className="text-sm text-slate-600 hover:text-slate-800">
          Edit
        </button>
        <button
          onClick={onDelete}
          className="text-sm text-slate-600 hover:text-slate-800">
          Delete
        </button>
      </div>
    </div>
  )
}
