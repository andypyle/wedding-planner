'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Guest, GuestStatus } from '../types/guest'

// In a real app, this would be replaced with API calls
const STORAGE_KEY = 'wedding-guests'

export function useGuests() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchGuests() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error('No user found')

        const { data, error } = await supabase
          .from('guests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })

        if (error) throw error
        setGuests(data || [])
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch guests')
        )
      } finally {
        setLoading(false)
      }
    }

    fetchGuests()
  }, [supabase])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guests))
  }, [guests])

  const addGuest = (guestData: Omit<Guest, 'id'>) => {
    const newGuest: Guest = {
      ...guestData,
      id: Math.random().toString(36).substr(2, 9),
    }
    setGuests((prev) => [...prev, newGuest])
  }

  const updateGuest = (id: string, guestData: Omit<Guest, 'id'>) => {
    setGuests((prev) =>
      prev.map((guest) => (guest.id === id ? { ...guestData, id } : guest))
    )
  }

  const deleteGuest = (id: string) => {
    setGuests((prev) => prev.filter((guest) => guest.id !== id))
  }

  const getGuestsByStatus = (status: GuestStatus) => {
    return guests.filter((guest) => guest.rsvp_status === status)
  }

  const getGuestsByGroup = (groupName: string) => {
    return guests.filter((guest) => guest.group_name === groupName)
  }

  const getTotalGuests = () => {
    return guests.length + guests.filter((guest) => guest.plus_one).length
  }

  const getConfirmedGuests = () => {
    return (
      getGuestsByStatus('attending').length +
      getGuestsByStatus('attending').filter((guest) => guest.plus_one).length
    )
  }

  return {
    guests,
    loading,
    error,
    addGuest,
    updateGuest,
    deleteGuest,
    getGuestsByStatus,
    getGuestsByGroup,
    getTotalGuests,
    getConfirmedGuests,
  }
}
