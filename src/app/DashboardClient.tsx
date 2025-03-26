'use client'

import { createClient } from '@/lib/supabase/client'
import { Guest } from '@/types/guest'
import { Vendor } from '@/types/vendor'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface DashboardClientProps {
  vendors: Vendor[]
  guests: Guest[]
  daysUntilWedding: number | null
}

interface ChecklistStats {
  total: number
  completed: number
  upcoming: number
  categories: {
    [key: string]: {
      total: number
      completed: number
    }
  }
}

const QuickStats = ({
  vendors,
  daysUntilWedding,
}: Omit<DashboardClientProps, 'guests'>) => {
  const stats = [
    { name: 'Total Vendors', value: vendors.length },
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
    {
      name: 'Days Until Wedding',
      value: daysUntilWedding !== null ? daysUntilWedding : 'Not Set',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-surface overflow-hidden shadow-sm rounded-lg border border-earth-200">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-earth-600 truncate">
              {stat.name}
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-earth-800">
              {stat.value}
            </dd>
          </div>
        </div>
      ))}
    </div>
  )
}

interface BudgetOverviewProps {
  vendors: Vendor[]
}

const BudgetOverview = ({ vendors }: BudgetOverviewProps) => {
  const totalBudget = vendors.reduce((total, vendor) => total + vendor.price, 0)
  const totalPaid = vendors.reduce((total, vendor) => {
    const vendorPaid = vendor.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    )
    return total + vendorPaid
  }, 0)
  const remainingBalance = vendors.reduce(
    (total, vendor) => total + vendor.remaining_balance,
    0
  )
  const paymentPercentage =
    totalBudget > 0 ? Math.round((totalPaid / totalBudget) * 100) : 0

  // Count payments per vendor
  const totalPayments = vendors.reduce(
    (total, vendor) => total + vendor.payments.length,
    0
  )

  return (
    <div className="bg-surface overflow-hidden shadow-sm rounded-lg border border-earth-200">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-earth-800 mb-3">
          Budget Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div>
            <dt className="text-sm font-medium text-earth-600">Total Budget</dt>
            <dd className="mt-1 text-2xl font-semibold text-earth-800">
              ${totalBudget.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-earth-600">Paid to Date</dt>
            <dd className="mt-1 text-2xl font-semibold text-earth-800">
              ${totalPaid.toLocaleString()}
              <span className="text-xs ml-1 text-earth-500">
                ({totalPayments} payment{totalPayments !== 1 ? 's' : ''})
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-earth-600">
              Remaining Balance
            </dt>
            <dd className="mt-1 text-2xl font-semibold text-earth-800">
              ${remainingBalance.toLocaleString()}
            </dd>
          </div>
        </div>

        <div className="w-full bg-earth-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full"
            style={{ width: `${paymentPercentage}%` }}></div>
        </div>
        <p className="text-sm text-earth-600 mt-2">
          {paymentPercentage}% of total budget paid
        </p>
      </div>
    </div>
  )
}

interface GuestOverviewProps {
  guests: Guest[]
}

const GuestOverview = ({ guests }: GuestOverviewProps) => {
  const totalGuests = guests.length
  const confirmedGuests = guests.filter(
    (g) => g.rsvp_status === 'attending'
  ).length
  const declinedGuests = guests.filter(
    (g) => g.rsvp_status === 'not_attending'
  ).length
  const pendingGuests = guests.filter((g) => g.rsvp_status === 'pending').length

  const rsvpPercentage =
    totalGuests > 0
      ? Math.round(((confirmedGuests + declinedGuests) / totalGuests) * 100)
      : 0

  return (
    <div className="bg-surface overflow-hidden shadow-sm rounded-lg border border-earth-200">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-earth-800">Guest Overview</h3>
          <Link
            href="/guests"
            className="text-sm text-primary hover:text-primary/80">
            View All Guests →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
          <div>
            <dt className="text-sm font-medium text-earth-600">Total Guests</dt>
            <dd className="mt-1 text-2xl font-semibold text-earth-800">
              {totalGuests}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-earth-600">Confirmed</dt>
            <dd className="mt-1 text-2xl font-semibold text-green-600">
              {confirmedGuests}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-earth-600">Declined</dt>
            <dd className="mt-1 text-2xl font-semibold text-red-600">
              {declinedGuests}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-earth-600">Pending</dt>
            <dd className="mt-1 text-2xl font-semibold text-yellow-600">
              {pendingGuests}
            </dd>
          </div>
        </div>

        <div className="w-full bg-earth-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full"
            style={{ width: `${rsvpPercentage}%` }}></div>
        </div>
        <p className="text-sm text-earth-600 mt-2">
          {rsvpPercentage}% of guests have responded
        </p>
      </div>
    </div>
  )
}

const ChecklistOverview = () => {
  const [stats, setStats] = useState<ChecklistStats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchChecklistStats()
  }, [])

  const fetchChecklistStats = async () => {
    try {
      const { data, error } = await supabase
        .from('checklist_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const stats: ChecklistStats = {
        total: data?.length || 0,
        completed: data?.filter((item) => item.completed).length || 0,
        upcoming:
          data?.filter(
            (item) =>
              !item.completed &&
              item.due_date &&
              new Date(item.due_date) > new Date()
          ).length || 0,
        categories: {},
      }

      data?.forEach((item) => {
        if (!stats.categories[item.category]) {
          stats.categories[item.category] = {
            total: 0,
            completed: 0,
          }
        }
        stats.categories[item.category].total++
        if (item.completed) {
          stats.categories[item.category].completed++
        }
      })

      setStats(stats)
    } catch (err) {
      console.error('Error fetching checklist stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-surface overflow-hidden shadow-sm rounded-lg border border-earth-200">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-earth-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-earth-200 rounded"></div>
              <div className="h-4 bg-earth-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface overflow-hidden shadow-sm rounded-lg border border-earth-200">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-earth-800">
            Checklist Progress
          </h3>
          <Link
            href="/checklist"
            className="text-sm text-primary hover:text-primary/80">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div>
            <dt className="text-sm font-medium text-earth-600">Total Tasks</dt>
            <dd className="mt-1 text-2xl font-semibold text-earth-800">
              {stats?.total || 0}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-earth-600">Completed</dt>
            <dd className="mt-1 text-2xl font-semibold text-green-600">
              {stats?.completed || 0}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-earth-600">Upcoming</dt>
            <dd className="mt-1 text-2xl font-semibold text-yellow-600">
              {stats?.upcoming || 0}
            </dd>
          </div>
        </div>

        <div className="w-full bg-earth-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full"
            style={{
              width: `${stats ? (stats.completed / stats.total) * 100 : 0}%`,
            }}></div>
        </div>
        <p className="text-sm text-earth-600 mt-2">
          {stats ? Math.round((stats.completed / stats.total) * 100) : 0}% of
          tasks completed
        </p>
      </div>
    </div>
  )
}

const QuickActions = () => {
  const actions = [
    {
      name: 'Add Vendor',
      href: '/vendors',
      description: 'Add a new vendor to your list',
    },
    {
      name: 'Add Guest',
      href: '/guests',
      description: 'Add guests to your list',
    },
    {
      name: 'Update Timeline',
      href: '/timeline',
      description: 'Update your wedding day timeline',
    },
    {
      name: 'Manage Checklist',
      href: '/checklist',
      description: 'Update your wedding checklist',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.name}
          href={action.href}
          className="relative group card hover:shadow-md transition-all">
          <div>
            <span className="rounded-lg inline-flex p-3 bg-primary/10 text-primary ring-4 ring-earth-100">
              {/* You can add icons here later */}
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium">
              <span className="absolute inset-0" aria-hidden="true" />
              {action.name}
            </h3>
            <p className="mt-2 text-sm text-earth-600">{action.description}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export function DashboardClient({
  vendors,
  guests,
  daysUntilWedding,
}: DashboardClientProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-earth-800">
          Wedding Dashboard
        </h1>
        <p className="mt-1 text-sm text-earth-600">
          Get an overview of your wedding planning progress
        </p>
      </div>

      <QuickStats vendors={vendors} daysUntilWedding={daysUntilWedding} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetOverview vendors={vendors} />
        <GuestOverview guests={guests} />
      </div>

      <ChecklistOverview />

      <div>
        <h2 className="text-lg font-medium text-earth-800 mb-4">
          Quick Actions
        </h2>
        <QuickActions />
      </div>
    </div>
  )
}
