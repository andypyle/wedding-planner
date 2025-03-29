'use client'

import { Card, CardBody, CardHeader } from '@/components/Card/Card'
import { ProgressBar } from '@/components/ProgressBar'
import Link from 'next/link'
import { GuestOverviewProps } from './types'

export function GuestOverview({ guests }: GuestOverviewProps) {
  console.log('GuestOverview - guests:', guests)
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

  console.log('GuestOverview - responsePercentage:', responsePercentage)

  return (
    <Card variant="bordered" theme="slate">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-slate-800">Guest Overview</h2>
          <Link
            href="/guests"
            className="text-sm text-slate-600 hover:text-slate-900">
            View All Guests →
          </Link>
        </div>
      </CardHeader>
      <CardBody>
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

        <ProgressBar
          value={responsePercentage}
          variant="default"
          showLabel={true}
          label={`${responsePercentage}% of guests have responded`}
        />
      </CardBody>
    </Card>
  )
}
