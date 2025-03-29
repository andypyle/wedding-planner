'use client'

import { Guest } from '@/types/guest'
import Link from 'next/link'

interface GuestOverviewProps {
  guests: Guest[]
}

export function GuestOverview({ guests }: GuestOverviewProps) {
  const totalGuests = guests.length
  const confirmedGuests = guests.filter(
    (guest) => guest.rsvp_status === 'attending'
  ).length
  const declinedGuests = guests.filter(
    (guest) => guest.rsvp_status === 'not_attending'
  ).length
  const pendingGuests = guests.filter(
    (guest) => guest.rsvp_status === 'pending'
  ).length

  const responsePercentage =
    totalGuests > 0
      ? Math.round(((confirmedGuests + declinedGuests) / totalGuests) * 100)
      : 0

  return (
    <div className="bg-slate-100 rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-slate-800">Guest Overview</h2>
        <Link
          href="/guests"
          className="text-sm text-slate-600 hover:text-slate-900">
          View All Guests →
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div>
          <h3 className="text-sm font-medium text-slate-600">Total Guests</h3>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {totalGuests}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-slate-600">Confirmed</h3>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {confirmedGuests}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-slate-600">Declined</h3>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {declinedGuests}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-slate-600">Pending</h3>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {pendingGuests}
          </p>
        </div>
      </div>

      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className="bg-slate-600 h-2 rounded-full"
          style={{ width: `${responsePercentage}%` }}
        />
      </div>
      <p className="text-sm text-slate-600 mt-2">
        {responsePercentage}% of guests have responded
      </p>
    </div>
  )
}
