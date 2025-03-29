'use client'

import { Button } from '@/components/Button/Button'
import { ConfirmDialog } from '@/components/ConfirmDialog/ConfirmDialog'
import { LoadingCard } from '@/components/LoadingCard/LoadingCard'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { TimelineEventCard } from '@/components/TimelineEventCard/TimelineEventCard'
import { TimelineEventModal } from '@/components/TimelineEventModal/TimelineEventModal'
import { Toast } from '@/components/Toast/Toast'
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
  const [userId, setUserId] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)
  const [isDeletingEvent, setIsDeletingEvent] = useState(false)
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

  const handleDeleteClick = (id: string) => {
    setEventToDelete(id)
  }

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return

    setIsDeletingEvent(true)
    setError(null)
    setSuccess(false)
    setOperationType('delete')

    try {
      const { error: deleteError } = await supabase
        .from('timeline_events')
        .delete()
        .eq('id', eventToDelete)

      if (deleteError) throw deleteError

      setSuccess(true)
      router.refresh()
      fetchEvents()
      setEventToDelete(null)
    } catch (err) {
      console.error('Error deleting event:', err)
      setError('Failed to delete event')
    } finally {
      setIsDeletingEvent(false)
    }
  }

  const formatTime = (time: string) => {
    if (/^\d{2}:\d{2}$/.test(time)) {
      return time
    }

    try {
      return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    } catch (err) {
      console.error('Error formatting time:', err)
      return time
    }
  }

  const handleEventSubmit = async (formData: {
    title: string
    description: string
    start_time: string
    end_time: string
    location: string
    vendor_name: string
    vendor_contact: string
    notes: string
  }) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      if (!userId) {
        throw new Error('User not authenticated')
      }

      if (selectedEvent) {
        setOperationType('update')
        const { error: updateError } = await supabase
          .from('timeline_events')
          .update({
            ...formData,
            end_time: formData.end_time || null,
          })
          .eq('id', selectedEvent.id)

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
      router.refresh()
      await fetchEvents()
      setIsModalOpen(false)
      setSelectedEvent(null)
    } catch (err) {
      console.error('Error saving event:', err)
      setError(
        selectedEvent ? 'Failed to update event' : 'Failed to create event'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Day-of Timeline"
          description="Plan and manage your wedding day schedule"
          action={{
            label: 'Loading...',
            onClick: () => {},
            loading: true,
          }}
        />

        <div className="space-y-4">
          <LoadingCard />
          <LoadingCard />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Day-of Timeline"
        description="Plan and manage your wedding day schedule"
        action={{
          label: 'Add Event',
          onClick: () => {
            setSelectedEvent(null)
            setIsModalOpen(true)
          },
          icon: (
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
          ),
        }}
      />

      {error && (
        <Toast type="error" message={error} onClose={() => setError(null)} />
      )}

      {success && (
        <Toast
          type="success"
          message={
            operationType === 'update'
              ? 'Event updated successfully!'
              : operationType === 'create'
              ? 'Event created successfully!'
              : 'Event deleted successfully!'
          }
          onClose={() => setSuccess(false)}
        />
      )}

      <TimelineEventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedEvent(null)
        }}
        onSubmit={handleEventSubmit}
        loading={isSubmitting}
      />

      <div className="space-y-4">
        {events.map((event) => (
          <TimelineEventCard
            key={event.id}
            event={event}
            onEdit={(event) => {
              setSelectedEvent(event)
              setIsModalOpen(true)
            }}
            onDelete={handleDeleteClick}
            formatTime={formatTime}
          />
        ))}

        {events.length === 0 && (
          <div className="bg-slate-100 p-6 rounded-lg border border-slate-200 text-center py-8">
            <p className="text-slate-600">No events added yet.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedEvent(null)
                setIsModalOpen(true)
              }}
              className="mt-4">
              Add your first event
            </Button>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!eventToDelete}
        onClose={() => setEventToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        isLoading={isDeletingEvent}
      />
    </div>
  )
}
