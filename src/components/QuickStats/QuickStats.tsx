'use client'

import { Card, CardBody, CardHeader } from '@/components/Card/Card'
import { QuickStatsProps } from './types'

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
    <Card variant="bordered" theme="slate">
      <CardHeader>
        <h3 className="text-lg font-medium text-slate-800">Vendor Overview</h3>
      </CardHeader>
      <CardBody>
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
      </CardBody>
    </Card>
  )
}
