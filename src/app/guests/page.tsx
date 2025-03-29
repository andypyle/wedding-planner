'use client'

import { createClient } from '@/lib/supabase/client'
import { Guest } from '@/types/guest'
import { useEffect, useState } from 'react'
import { AddGuestModal } from './AddGuestModal'
import { EditGuestModal } from './EditGuestModal'

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchGuests = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching guests:', error)
      return
    }

    setGuests(data || [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchGuests()
  }, [])

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this guest?')) return

    const supabase = createClient()
    const { error } = await supabase.from('guests').delete().eq('id', id)

    if (error) {
      console.error('Error deleting guest:', error)
      return
    }

    fetchGuests()
  }

  const GuestCard = ({ guest }: { guest: Guest }) => {
    return (
      <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-slate-800">
                {guest.first_name} {guest.last_name}
              </h3>
              {guest.plus_one && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-slate-200 text-slate-800">
                  +1
                </span>
              )}
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-800 mt-1">
              {guest.group}
            </span>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-800">
            {guest.rsvp_status}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div>
            <span className="text-slate-600">Email</span>
            <p className="font-medium text-slate-800 break-all">
              {guest.email}
            </p>
          </div>
          <div>
            <span className="text-slate-600">Phone</span>
            <p className="font-medium text-slate-800">{guest.phone}</p>
          </div>
          {guest.dietary_restrictions && (
            <div>
              <span className="text-slate-600">Dietary</span>
              <p className="font-medium text-slate-800">
                {guest.dietary_restrictions}
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-3 pt-2 border-t border-slate-200">
          <button
            onClick={() => handleEdit(guest)}
            className="text-sm text-slate-600 hover:text-slate-800">
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

  const sortedGuests = [...guests].sort((a, b) => {
    const statusOrder = { attending: 0, pending: 1, not_attending: 2 }
    return statusOrder[a.rsvp_status] - statusOrder[b.rsvp_status]
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Guests</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage your wedding guests
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200">
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Add Guest
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
        </div>
      ) : (
        <>
          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {sortedGuests.length === 0 ? (
              <div className="text-center py-8 text-sm text-slate-500">
                No guests yet.{' '}
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="text-slate-600 hover:text-slate-800">
                  Add your first guest
                </button>
              </div>
            ) : (
              sortedGuests.map((guest) => (
                <GuestCard key={guest.id} guest={guest} />
              ))
            )}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block">
            <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Guest
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Group
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {sortedGuests.map((guest) => (
                      <tr key={guest.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-800">
                            {guest.first_name} {guest.last_name}
                            {guest.plus_one && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-200 text-slate-800">
                                +1
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-800">
                            {guest.email}
                          </div>
                          <div className="text-sm text-slate-600">
                            {guest.phone}
                          </div>
                          {guest.dietary_restrictions && (
                            <div className="text-sm text-slate-600">
                              Dietary: {guest.dietary_restrictions}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-800">
                            {guest.group}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-800">
                            {guest.rsvp_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(guest)}
                            className="text-slate-600 hover:text-slate-800 mr-4">
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(guest.id)}
                            className="text-slate-600 hover:text-slate-800">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      <AddGuestModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchGuests}
      />

      {editingGuest && (
        <EditGuestModal
          guest={editingGuest}
          isOpen={!!editingGuest}
          onClose={() => setEditingGuest(null)}
          onSuccess={fetchGuests}
        />
      )}
    </div>
  )
}
