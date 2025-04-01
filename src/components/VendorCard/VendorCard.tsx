'use client'

import { Button } from '@/components/Button/Button'
import { ProgressBar } from '@/components/ProgressBar'
import { VendorCardProps } from './types'

export function VendorCard({ vendor, onEdit, onDelete }: VendorCardProps) {
  const totalPaid = vendor.payments?.reduce((sum, p) => sum + p.amount, 0) || 0
  const progress = (totalPaid / vendor.price) * 100
  const remainingBalance = vendor.price - totalPaid

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start min-h-[4rem]">
          <div>
            <h3 className="text-lg font-medium text-slate-900">
              {vendor.name}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{vendor.contact_name}</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
            {vendor.category}
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-end mt-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Total Price</span>
                <span className="font-medium text-slate-900">
                  ${vendor.price.toLocaleString()}
                </span>
              </div>
              <div className="mt-2">
                <ProgressBar value={progress} max={100} />
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-slate-600">Paid</span>
                <span className="font-medium text-slate-900">
                  ${totalPaid.toLocaleString()}
                </span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-slate-600">Remaining</span>
                <span className="font-medium text-slate-900">
                  ${remainingBalance.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Status</span>
              <span className="font-medium text-slate-900">
                {vendor.status}
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button
              onClick={onEdit}
              className="text-slate-600 hover:text-slate-800">
              Edit
            </Button>
            <Button onClick={onDelete} variant="danger">
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
