'use client'

import { GuestCard } from '@/components/GuestCard'
import { GuestForm } from '@/components/GuestForm'
import { GuestList } from '@/components/GuestList'
import { Guest, GuestStatus } from '@/types/guest'
import { useState } from 'react'
import { addGuest, deleteGuest, updateGuest } from './actions'

const GUEST_STATUSES: GuestStatus[] = [
  'Not Sent',
  'Invited',
  'Confirmed',
  'Declined',
  'Maybe',
]

type ViewMode = 'grid' | 'list'

interface GuestsClientProps {
  initialGuests: Guest[]
}

export function GuestsClient({ initialGuests }: GuestsClientProps) {
  const [guests] = useState(initialGuests)
  const [showForm, setShowForm] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | undefined>()
  const [selectedStatus, setSelectedStatus] = useState<GuestStatus | 'All'>(
    'All'
  )
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (
    guestData: Omit<Guest, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    try {
      setIsSubmitting(true)
      const formData = new FormData()
      Object.entries(guestData).forEach(([key, value]) => {
        formData.append(key, value.toString())
      })

      if (editingGuest) {
        await updateGuest(editingGuest.id, formData)
      } else {
        await addGuest(formData)
      }

      // Refresh the page to get updated data
      window.location.reload()
    } catch (error) {
      console.error('Error saving guest:', error)
      alert('Failed to save guest. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this guest?')) {
      try {
        await deleteGuest(id)
        // Refresh the page to get updated data
        window.location.reload()
      } catch (error) {
        console.error('Error deleting guest:', error)
        alert('Failed to delete guest. Please try again.')
      }
    }
  }

  const filteredGuests =
    selectedStatus === 'All'
      ? guests
      : guests.filter((guest) => guest.rsvp_status === selectedStatus)

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Guest List</h1>
            <p className="mt-2 text-sm text-gray-700">
              Total Guests: {guests.length} | Confirmed:{' '}
              {guests.filter((g) => g.rsvp_status === 'Confirmed').length}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => {
                setEditingGuest(undefined)
                setShowForm(true)
              }}
              className="btn-primary">
              Add Guest
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <select
            className="input max-w-xs"
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as GuestStatus | 'All')
            }>
            <option value="All">All Statuses</option>
            {GUEST_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${
                viewMode === 'grid'
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              aria-label="Grid view">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list'
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              aria-label="List view">
              <svg
                className="w-5 h-5"
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
          </div>
        </div>

        <div className="mt-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGuests.map((guest) => (
                <GuestCard
                  key={guest.id}
                  guest={guest}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <GuestList
              guests={filteredGuests}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {filteredGuests.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No guests found. Click &quot;Add Guest&quot; to get started!
            </p>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">
              {editingGuest ? 'Edit Guest' : 'Add New Guest'}
            </h2>
            <GuestForm
              guest={editingGuest}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false)
                setEditingGuest(undefined)
              }}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  )
}
