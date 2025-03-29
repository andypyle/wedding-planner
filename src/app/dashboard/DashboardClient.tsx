'use client'

import { BudgetOverview } from '@/components/BudgetOverview'
import { Card, CardBody, CardHeader } from '@/components/Card/Card'
import { ChecklistStats } from '@/components/ChecklistStats'
import { GuestOverview } from '@/components/GuestOverview'
import { ChecklistItem } from '@/types/checklist'
import { Guest } from '@/types/guest'
import { Vendor } from '@/types/vendor'
import Link from 'next/link'

interface DashboardClientProps {
  guests: Guest[]
  vendors: Vendor[]
  checklistItems: ChecklistItem[]
  weddingDate: Date | null
}

export default function DashboardClient({
  guests,
  vendors,
  checklistItems,
  weddingDate,
}: DashboardClientProps) {
  // Calculate days until wedding
  const daysUntilWedding = weddingDate
    ? Math.ceil(
        (weddingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
    : null

  // Calculate vendor stats
  const totalVendors = vendors.length
  const bookedVendors = vendors.filter(
    (v) =>
      v.status === 'Booked' ||
      v.status === 'Deposit Paid' ||
      v.status === 'Paid in Full'
  ).length
  const pendingVendors = vendors.filter(
    (v) => v.status === 'Contacted' || v.status === 'Meeting Scheduled'
  ).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Welcome back! Here's an overview of your wedding planning progress.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-100 rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-slate-600">
            Days Until Wedding
          </h3>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {daysUntilWedding ?? 'Not set'}
          </p>
        </div>
        <div className="bg-slate-100 rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-slate-600">Total Vendors</h3>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {totalVendors}
          </p>
        </div>
        <div className="bg-slate-100 rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-slate-600">Booked Vendors</h3>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {bookedVendors}
          </p>
        </div>
        <div className="bg-slate-100 rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-slate-600">
            Pending Vendors
          </h3>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {pendingVendors}
          </p>
        </div>
      </div>

      {/* Budget and Guest Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BudgetOverview vendors={vendors} />
        <GuestOverview guests={guests} />
      </div>

      {/* Checklist Progress */}
      <Card variant="bordered" theme="slate">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-slate-800">
              Checklist Progress
            </h2>
            <Link
              href="/checklist"
              className="text-sm text-slate-600 hover:text-slate-900">
              View All Tasks →
            </Link>
          </div>
        </CardHeader>
        <CardBody>
          <ChecklistStats items={checklistItems} />
        </CardBody>
      </Card>
    </div>
  )
}
