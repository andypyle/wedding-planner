'use client'

import { createClient } from '@/lib/supabase/client'
import { Guest } from '@/types/guest'
import { Vendor } from '@/types/vendor'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardClient } from '../DashboardClient'

export default function DashboardPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [guests, setGuests] = useState<Guest[]>([])
  const [daysUntilWedding, setDaysUntilWedding] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) {
          router.push('/login')
          return
        }

        // Fetch vendors
        const { data: vendorsData, error: vendorsError } = await supabase
          .from('vendors')
          .select('*, payments(*)')
          .eq('user_id', userData.user.id)
          .order('name')

        if (vendorsError) throw vendorsError

        // Fetch guests
        const { data: guestsData, error: guestsError } = await supabase
          .from('guests')
          .select('*')
          .eq('user_id', userData.user.id)
          .order('first_name')

        if (guestsError) throw guestsError

        // Fetch profile for wedding date
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('wedding_date')
          .eq('id', userData.user.id)
          .single()

        if (profileError) throw profileError

        // Calculate days until wedding
        const daysUntil = profile?.wedding_date
          ? Math.ceil(
              (new Date(profile.wedding_date).getTime() -
                new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : null

        setVendors(vendorsData || [])
        setGuests(guestsData || [])
        setDaysUntilWedding(daysUntil)
      } catch (err) {
        console.error('Error initializing dashboard:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    initializeDashboard()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <DashboardClient
      vendors={vendors}
      guests={guests}
      daysUntilWedding={daysUntilWedding}
    />
  )
}
