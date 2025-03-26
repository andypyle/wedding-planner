'use client'

import { useEffect, useState } from 'react'
import { Guest } from '../types/guest'

// In a real app, this would be replaced with API calls
const STORAGE_KEY = 'wedding-guests'

export function useGuests() {
  const [guests, setGuests] = useState<Guest[]>([])

  useEffect(() => {
    const savedGuests = localStorage.getItem(STORAGE_KEY)
    if (savedGuests) {
      setGuests(JSON.parse(savedGuests))
    }
  }, [])

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

  const getGuestsByStatus = (status: Guest['status']) => {
    return guests.filter((guest) => guest.status === status)
  }

  const getGuestsByGroup = (group: string) => {
    return guests.filter((guest) => guest.group === group)
  }

  const getTotalGuests = () => {
    return guests.length + guests.filter((guest) => guest.plusOne).length
  }

  const getConfirmedGuests = () => {
    return (
      getGuestsByStatus('Confirmed').length +
      getGuestsByStatus('Confirmed').filter((guest) => guest.plusOne).length
    )
  }

  return {
    guests,
    addGuest,
    updateGuest,
    deleteGuest,
    getGuestsByStatus,
    getGuestsByGroup,
    getTotalGuests,
    getConfirmedGuests,
  }
}
