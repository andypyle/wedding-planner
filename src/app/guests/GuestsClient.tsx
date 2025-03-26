'use client'

import { createClient } from '@/lib/supabase/client'
import { Guest, GuestStatus } from '@/types/guest'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { addGuest, deleteGuest, updateGuest } from './actions'

const GUEST_STATUSES: GuestStatus[] = ['pending', 'attending', 'not_attending']

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  attending: 'bg-green-100 text-green-800',
  not_attending: 'bg-red-100 text-red-800',
}

type ViewMode = 'grid' | 'list'

interface GuestsClientProps {
  initialGuests: Guest[]
}

export default function GuestsClient({ initialGuests }: GuestsClientProps) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    guestId?: string
  ) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      if (guestId) {
        await updateGuest(guestId, formData)
      } else {
        await addGuest(formData)
      }
      router.refresh()
      fetchGuests()
    } catch (err) {
      console.error('Error saving guest:', err)
      setError('Failed to save guest')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this guest?')) return

    setLoading(true)
    setError(null)

    try {
      await deleteGuest(id)
      router.refresh()
      fetchGuests()
    } catch (err) {
      console.error('Error deleting guest:', err)
      setError('Failed to delete guest')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (
    guestId: string,
    newStatus: GuestStatus
  ) => {
    setLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('guests')
        .update({ rsvp_status: newStatus })
        .eq('id', guestId)

      if (updateError) throw updateError

      router.refresh()
      fetchGuests()
    } catch (err) {
      console.error('Error updating guest status:', err)
      setError('Failed to update guest status')
    } finally {
      setLoading(false)
    }
  }

  const fetchGuests = async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setGuests(data || [])
    } catch (err) {
      console.error('Error fetching guests:', err)
      setError('Failed to load guests')
    }
  }

  const filteredGuests = guests.filter((guest) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      guest.first_name.toLowerCase().includes(searchLower) ||
      guest.last_name.toLowerCase().includes(searchLower) ||
      guest.email.toLowerCase().includes(searchLower) ||
      guest.group.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-earth-800">Guests</h1>
          <p className="mt-1 text-sm text-earth-600">
            Manage your wedding guests
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search guests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-earth-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list'
                  ? 'bg-primary text-white'
                  : 'text-earth-600 hover:text-earth-800'
              }`}>
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid'
                  ? 'bg-primary text-white'
                  : 'text-earth-600 hover:text-earth-800'
              }`}>
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuests.map((guest) => (
            <div key={guest.id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-earth-800">
                    {guest.first_name} {guest.last_name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      STATUS_COLORS[guest.rsvp_status]
                    }`}>
                    {guest.rsvp_status}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusChange(guest.id, 'attending')}
                    className="text-green-600 hover:text-green-800">
                    Confirm
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(guest.id, 'not_attending')
                    }
                    className="text-red-600 hover:text-red-800">
                    Decline
                  </button>
                  <button
                    onClick={() => handleDelete(guest.id)}
                    className="text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-earth-600">{guest.email}</p>
                <p className="text-sm text-earth-600">{guest.phone}</p>
                <p className="text-sm text-earth-600">{guest.group}</p>
                {guest.dietary_restrictions && (
                  <p className="text-sm text-earth-600">
                    Dietary: {guest.dietary_restrictions}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-earth-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">
                  Group
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-earth-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-earth-200">
              {filteredGuests.map((guest) => (
                <tr key={guest.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-earth-900">
                      {guest.first_name} {guest.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-earth-900">{guest.email}</div>
                    <div className="text-sm text-earth-500">{guest.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-earth-900">{guest.group}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_COLORS[guest.rsvp_status]
                      }`}>
                      {guest.rsvp_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() =>
                          handleStatusChange(guest.id, 'attending')
                        }
                        className="text-green-600 hover:text-green-800">
                        Confirm
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(guest.id, 'not_attending')
                        }
                        className="text-red-600 hover:text-red-800">
                        Decline
                      </button>
                      <button
                        onClick={() => handleDelete(guest.id)}
                        className="text-red-600 hover:text-red-800">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredGuests.length === 0 && (
        <div className="text-center py-8">
          <p className="text-earth-600">No guests found</p>
        </div>
      )}
    </div>
  )
}
