'use client'

import { Button } from '@/components/Button/Button'
import { VendorListItemProps } from './types'

export function VendorListItem({
  vendor,
  onEdit,
  onDelete,
}: VendorListItemProps) {
  const totalPaid = vendor.payments.reduce((sum, p) => sum + p.amount, 0)
  const remainingBalance = vendor.price - totalPaid

  return (
    <tr className="hover:bg-slate-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-slate-800">{vendor.name}</div>
        <div className="text-sm text-slate-500">{vendor.contact_name}</div>
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
        <Button
          onClick={onEdit}
          className="text-slate-600 hover:text-slate-800 mr-4">
          Edit
        </Button>
        <Button
          onClick={onDelete}
          className="text-slate-600 hover:text-slate-800">
          Delete
        </Button>
      </td>
    </tr>
  )
}
