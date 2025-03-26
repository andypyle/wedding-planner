'use client'

import { deleteGuest, getGuests } from '@/app/actions/guests'
import { createClient } from '@/lib/supabase/client'
import { Guest } from '@/types/guest'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { EditGuestModal } from './EditGuestModal'

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const router = useRouter()

  // Fetch guests on component mount
  useEffect(() => {
    const fetchGuests = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push('/login')
        return
      }

      const guests = await getGuests()
      setGuests(guests)
    }

    fetchGuests()
  }, [router])

  const handleDelete = async (id: string) => {
    await deleteGuest(id)
    setGuests(guests.filter((g) => g.id !== id))
  }

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest)
  }

  const handleUpdateSuccess = async () => {
    const updatedGuests = await getGuests()
    setGuests(updatedGuests)
  }

  // Sort guests by name
  const sortedGuests = [...guests].sort((a, b) =>
    `${a.first_name} ${a.last_name}`.localeCompare(
      `${b.first_name} ${b.last_name}`
    )
  )

  const GuestCard = ({ guest }: { guest: Guest }) => {
    return (
      <div className="bg-white p-4 rounded-lg border border-earth-200 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-earth-800">
                {guest.first_name} {guest.last_name}
              </h3>
              {guest.plus_one && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-earth-100 text-earth-800">
                  +1
                </span>
              )}
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-earth-800 mt-1">
              {guest.group}
            </span>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-earth-800">
            {guest.rsvp_status}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div>
            <span className="text-earth-600">Email</span>
            <p className="font-medium text-earth-800 break-all">
              {guest.email}
            </p>
          </div>
          <div>
            <span className="text-earth-600">Phone</span>
            <p className="font-medium text-earth-800">{guest.phone}</p>
          </div>
          {guest.dietary_restrictions && (
            <div>
              <span className="text-earth-600">Dietary</span>
              <p className="font-medium text-earth-800">
                {guest.dietary_restrictions}
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-3 pt-2 border-t border-earth-100">
          <button
            onClick={() => handleEdit(guest)}
            className="text-sm text-primary hover:text-primary-dark">
            Edit
          </button>
          <button
            onClick={() => handleDelete(guest.id)}
            className="text-sm text-red-600 hover:text-red-900">
            Delete
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-earth-800">Guests</h1>
          <p className="mt-1 text-sm text-earth-600">
            Manage your wedding guests
          </p>
        </div>
        <Link
          href="/guests/new"
          className="btn btn-primary flex items-center gap-1">
          <svg
            className="h-5 w-5"
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
          <span>Add Guest</span>
        </Link>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {sortedGuests.length === 0 ? (
          <div className="text-center py-8 text-sm text-earth-500">
            No guests yet.{' '}
            <a
              href="/guests/new"
              className="text-primary hover:text-primary-dark">
              Add your first guest
            </a>
          </div>
        ) : (
          sortedGuests.map((guest) => (
            <GuestCard key={guest.id} guest={guest} />
          ))
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block bg-surface rounded-lg shadow-sm border border-earth-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-earth-200">
            <thead className="bg-earth-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">
                  Guest
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">
                  Group
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">
                  Dietary
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-earth-500 uppercase tracking-wider">
                  RSVP
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-earth-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-earth-200">
              {sortedGuests.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-sm text-earth-500">
                    No guests yet.{' '}
                    <a
                      href="/guests/new"
                      className="text-primary hover:text-primary-dark">
                      Add your first guest
                    </a>
                  </td>
                </tr>
              ) : (
                sortedGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-earth-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-earth-800">
                          {guest.first_name} {guest.last_name}
                        </div>
                        {guest.plus_one && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-earth-100 text-earth-800">
                            +1
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-earth-800">
                        {guest.group}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-earth-800">
                        {guest.email}
                      </div>
                      <div className="text-sm text-earth-600">
                        {guest.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-earth-800">
                      {guest.dietary_restrictions || 'None'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-earth-800">
                        {guest.rsvp_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(guest)}
                        className="text-primary hover:text-primary-dark mr-4">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(guest.id)}
                        className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingGuest && (
        <EditGuestModal
          guest={editingGuest}
          isOpen={!!editingGuest}
          onClose={() => setEditingGuest(null)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  )
}
