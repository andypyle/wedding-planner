'use client'

import { BudgetOverview } from '@/components/BudgetOverview'
import { Card, CardBody } from '@/components/Card/Card'
import { ChecklistStats } from '@/components/ChecklistStats'
import { GuestOverview } from '@/components/GuestOverview'
import { useChecklist } from '@/hooks/useChecklist'
import { useGuests } from '@/hooks/useGuests'
import { useVendors } from '@/hooks/useVendors'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [weddingDate, setWeddingDate] = useState<Date | null>(null)
  const supabase = createClient()
  const { vendors } = useVendors()
  const { guests, loading: guestsLoading } = useGuests()
  const { items, isLoading: checklistLoading } = useChecklist()

  useEffect(() => {
    console.log('Guests:', guests)
    console.log('Checklist items:', items)
  }, [guests, items])

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Get wedding date from profiles
      const { data: profileData } = await supabase
        .from('profiles')
        .select('wedding_date')
        .eq('id', user.id)
        .single()

      if (profileData?.wedding_date) {
        setWeddingDate(new Date(profileData.wedding_date))
      }

      setLoading(false)
    }

    checkAuth()
  }, [supabase, router])

  if (loading || guestsLoading || checklistLoading) {
    return <div>Loading...</div>
  }

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
        <Card variant="bordered" theme="slate">
          <CardBody>
            <h3 className="text-sm font-medium text-slate-600">
              Days Until Wedding
            </h3>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {daysUntilWedding ?? 'Not set'}
            </p>
          </CardBody>
        </Card>
        <Card variant="bordered" theme="slate">
          <CardBody>
            <h3 className="text-sm font-medium text-slate-600">
              Total Vendors
            </h3>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {totalVendors}
            </p>
          </CardBody>
        </Card>
        <Card variant="bordered" theme="slate">
          <CardBody>
            <h3 className="text-sm font-medium text-slate-600">
              Booked Vendors
            </h3>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {bookedVendors}
            </p>
          </CardBody>
        </Card>
        <Card variant="bordered" theme="slate">
          <CardBody>
            <h3 className="text-sm font-medium text-slate-600">
              Pending Vendors
            </h3>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {pendingVendors}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Budget and Guest Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BudgetOverview vendors={vendors} />
        <GuestOverview guests={guests} />
      </div>

      {/* Checklist Progress */}
      <ChecklistStats items={items} />
    </div>
  )
}
