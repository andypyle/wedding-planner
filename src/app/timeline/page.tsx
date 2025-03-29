'use client'

import { Modal } from '@/components/Modal'
import TimelineEventForm from '@/components/TimelineEventForm'
import { createClient } from '@/lib/supabase/client'
import { TimelineEvent } from '@/types/timeline'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type OperationType = 'create' | 'update' | 'delete'

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [operationType, setOperationType] = useState<OperationType | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const initializePage = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) {
          router.push('/login')
          return
        }
        setUserId(userData.user.id)
        await fetchEvents()
      } catch (err) {
        console.error('Error checking authentication:', err)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    initializePage()
  }, [router])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .order('start_time', { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (err) {
      console.error('Error fetching events:', err)
      setError('Failed to load timeline events')
    }
  }

  const handleEdit = (event: TimelineEvent) => {
    setEditingEvent(event)
    setShowForm(true)
  }

  const handleSubmit = async (formData: {
    title: string
    description: string
    start_time: string
    end_time: string
    location: string
    vendor_name: string
    vendor_contact: string
    notes: string
  }) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      if (!userId) {
        throw new Error('User not authenticated')
      }

      if (editingEvent) {
        setOperationType('update')
        const { error: updateError } = await supabase
          .from('timeline_events')
          .update({
            ...formData,
            end_time: formData.end_time || null,
          })
          .eq('id', editingEvent.id)

        if (updateError) throw updateError
      } else {
        setOperationType('create')
        const { error: insertError } = await supabase
          .from('timeline_events')
          .insert([
            {
              ...formData,
              end_time: formData.end_time || null,
              user_id: userId,
            },
          ])

        if (insertError) throw insertError
      }

      setSuccess(true)
      setShowForm(false)
      setEditingEvent(null)
      router.refresh()
      fetchEvents()
    } catch (err) {
      console.error('Error saving event:', err)
      setError(
        editingEvent ? 'Failed to update event' : 'Failed to create event'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    setLoading(true)
    setError(null)
    setSuccess(false)
    setOperationType('delete')

    try {
      const { error: deleteError } = await supabase
        .from('timeline_events')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setSuccess(true)
      router.refresh()
      fetchEvents()
    } catch (err) {
      console.error('Error deleting event:', err)
      setError('Failed to delete event')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingEvent(null)
    setOperationType(null)
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Day-of Timeline
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Plan and manage your wedding day schedule
            </p>
          </div>
          <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Loading...
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-100 p-6 rounded-lg border border-slate-200 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            </div>
          </div>
          <div className="bg-slate-100 p-6 rounded-lg border border-slate-200 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Day-of Timeline
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Plan and manage your wedding day schedule
          </p>
        </div>
        <button
          onClick={() => {
            setEditingEvent(null)
            setShowForm(true)
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200">
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Add Event
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {operationType === 'update'
            ? 'Event updated successfully!'
            : operationType === 'create'
            ? 'Event created successfully!'
            : 'Event deleted successfully!'}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={handleCancel}
        title={editingEvent ? 'Edit Event' : 'Add Event'}>
        <TimelineEventForm
          event={editingEvent || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </Modal>

      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-slate-100 p-6 rounded-lg border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-slate-800">
                  {event.title}
                </h3>
                <p className="text-sm text-slate-600">
                  {formatTime(event.start_time)}
                  {event.end_time && ` - ${formatTime(event.end_time)}`}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="text-slate-600 hover:text-slate-800">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-red-600 hover:text-red-800">
                  Delete
                </button>
              </div>
            </div>

            {event.description && (
              <p className="mt-2 text-slate-700">{event.description}</p>
            )}

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {event.location && (
                <div>
                  <h4 className="text-sm font-medium text-slate-600">
                    Location
                  </h4>
                  <p className="mt-1 text-slate-700">{event.location}</p>
                </div>
              )}

              {event.vendor_name && (
                <div>
                  <h4 className="text-sm font-medium text-slate-600">Vendor</h4>
                  <p className="mt-1 text-slate-700">{event.vendor_name}</p>
                </div>
              )}

              {event.vendor_contact && (
                <div>
                  <h4 className="text-sm font-medium text-slate-600">
                    Vendor Contact
                  </h4>
                  <p className="mt-1 text-slate-700">{event.vendor_contact}</p>
                </div>
              )}

              {event.notes && (
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-slate-600">Notes</h4>
                  <p className="mt-1 text-slate-700">{event.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {events.length === 0 && !showForm && (
          <div className="bg-slate-100 p-6 rounded-lg border border-slate-200 text-center py-8">
            <p className="text-slate-600">No events added yet.</p>
            <button
              onClick={() => {
                setEditingEvent(null)
                setShowForm(true)
              }}
              className="mt-4 text-slate-600 hover:text-slate-800">
              Add your first event
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
