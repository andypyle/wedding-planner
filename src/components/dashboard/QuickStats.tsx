'use client'

import { Vendor } from '@/types/vendor'

interface QuickStatsProps {
  vendors: Vendor[]
}

export function QuickStats({ vendors }: QuickStatsProps) {
  const stats = [
    {
      name: 'Total Vendors',
      value: vendors.length,
    },
    {
      name: 'Booked Vendors',
      value: vendors.filter(
        (v) =>
          v.status === 'Booked' ||
          v.status === 'Deposit Paid' ||
          v.status === 'Paid in Full'
      ).length,
    },
    {
      name: 'Pending Vendors',
      value: vendors.filter(
        (v) => v.status === 'Contacted' || v.status === 'Meeting Scheduled'
      ).length,
    },
  ]

  return (
    <div className="overflow-hidden shadow-sm rounded-lg border border-slate-200 bg-slate-100">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-slate-800 mb-3">
          Vendor Overview
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.name}>
              <dt className="text-sm font-medium text-slate-600 truncate">
                {stat.name}
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-slate-800">
                {stat.value}
              </dd>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
