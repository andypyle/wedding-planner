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
          className="overflow-hidden shadow-sm rounded-lg border border-slate-200 bg-slate-100">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-slate-600 truncate">
              {stat.name}
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-slate-800">
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
    <div className="overflow-hidden shadow-sm rounded-lg border border-slate-200 bg-slate-100">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-slate-800 mb-3">
          Budget Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div>
            <dt className="text-sm font-medium text-slate-600">Total Budget</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-800">
              ${totalBudget.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-600">Paid to Date</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-800">
              ${totalPaid.toLocaleString()}
              <span className="text-xs ml-1 text-slate-500">
                ({totalPayments} payment{totalPayments !== 1 ? 's' : ''})
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-600">
              Remaining Balance
            </dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-800">
              ${remainingBalance.toLocaleString()}
            </dd>
          </div>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-2.5">
          <div
            className="bg-slate-600 h-2.5 rounded-full"
            style={{ width: `${paymentPercentage}%` }}></div>
        </div>
        <p className="text-sm text-slate-600 mt-2">
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
    <div className="overflow-hidden shadow-sm rounded-lg border border-slate-200 bg-slate-100">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-slate-800">Guest Overview</h3>
          <Link
            href="/guests"
            className="text-sm text-slate-600 hover:text-slate-800">
            View All Guests →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
          <div>
            <dt className="text-sm font-medium text-slate-600">Total Guests</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-800">
              {totalGuests}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-600">Confirmed</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-700">
              {confirmedGuests}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-600">Declined</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-700">
              {declinedGuests}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-600">Pending</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-700">
              {pendingGuests}
            </dd>
          </div>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-2.5">
          <div
            className="bg-slate-600 h-2.5 rounded-full"
            style={{ width: `${rsvpPercentage}%` }}></div>
        </div>
        <p className="text-sm text-slate-600 mt-2">
          {rsvpPercentage}% of guests have responded
        </p>
      </div>
    </div>
  )
}

const ChecklistOverview = () => {
  const [stats, setStats] = useState<ChecklistStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchChecklistStats = async () => {
    try {
      const { data, error } = await supabase
        .from('checklist_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        const stats: ChecklistStats = {
          total: data.length,
          completed: data.filter((item) => item.completed).length,
          upcoming: data.filter(
            (item) =>
              !item.completed &&
              item.due_date &&
              new Date(item.due_date) > new Date()
          ).length,
          categories: {},
        }

        data.forEach((item) => {
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
        setError(null)
      }
    } catch (err) {
      console.error('Error fetching checklist stats:', err)
      setError('Failed to load checklist data')
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      try {
        await fetchChecklistStats()
      } catch (err) {
        if (!mounted) return
        console.error('Error in useEffect:', err)
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [])

  if (error) {
    return (
      <div className="overflow-hidden shadow-sm rounded-lg border border-slate-200 bg-slate-100">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-slate-800">
              Checklist Progress
            </h3>
            <Link
              href="/checklist"
              className="text-sm text-slate-600 hover:text-slate-800">
              View All Tasks →
            </Link>
          </div>
          <div className="text-center py-4">
            <p className="text-slate-600">{error}</p>
            <button
              onClick={() => {
                setLoading(true)
                setError(null)
                fetchChecklistStats()
              }}
              className="mt-2 text-slate-600 hover:text-slate-800 text-sm">
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden shadow-sm rounded-lg border border-slate-200 bg-slate-100">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-slate-800">
            Checklist Progress
          </h3>
          <Link
            href="/checklist"
            className="text-sm text-slate-600 hover:text-slate-800">
            View All Tasks →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-600"></div>
          </div>
        ) : stats ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-semibold text-slate-800">
                  {stats.total}
                </div>
                <div className="text-sm text-slate-600">Total Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-slate-700">
                  {stats.completed}
                </div>
                <div className="text-sm text-slate-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-slate-700">
                  {stats.upcoming}
                </div>
                <div className="text-sm text-slate-600">Upcoming</div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-sm font-medium text-slate-700 mb-3">
                By Category
              </h4>
              <div className="space-y-3">
                {Object.entries(stats.categories).map(
                  ([category, categoryStats]) => (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">{category}</span>
                        <span className="font-medium text-slate-800">
                          {categoryStats.completed}/{categoryStats.total}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div
                          className="bg-slate-600 h-1.5 rounded-full"
                          style={{
                            width: `${
                              (categoryStats.completed / categoryStats.total) *
                              100
                            }%`,
                          }}></div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-slate-600">No checklist items yet</p>
            <Link
              href="/checklist"
              className="mt-2 text-slate-600 hover:text-slate-800 text-sm">
              Add your first item
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

const QuickActions = () => {
  const actions = [
    {
      name: 'Add Vendor',
      description: 'Add a new vendor to your wedding planning list',
      href: '/vendors/new',
    },
    {
      name: 'Add Guest',
      description: 'Add a new guest to your wedding guest list',
      href: '/guests/new',
    },
    {
      name: 'Add Task',
      description: 'Add a new task to your wedding checklist',
      href: '/checklist/new',
    },
    {
      name: 'View Timeline',
      description: 'View your wedding planning timeline',
      href: '/timeline',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.name}
          href={action.href}
          className="relative group overflow-hidden shadow-sm rounded-lg border border-slate-200 p-6 transition-all duration-200 hover:shadow-md bg-slate-100">
          <div>
            <span className="rounded-lg inline-flex p-3 bg-slate-200 text-slate-600 ring-4 ring-slate-50">
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
            <h3 className="text-lg font-medium text-slate-800">
              <span className="absolute inset-0" aria-hidden="true" />
              {action.name}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{action.description}</p>
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
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Welcome back! Here's an overview of your wedding planning progress.
        </p>
      </div>

      <QuickStats vendors={vendors} daysUntilWedding={daysUntilWedding} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetOverview vendors={vendors} />
        <GuestOverview guests={guests} />
      </div>

      <ChecklistOverview />

      <div>
        <h2 className="text-lg font-medium text-slate-800 mb-4">
          Quick Actions
        </h2>
        <QuickActions />
      </div>
    </div>
  )
}
