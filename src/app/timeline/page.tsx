'use client'

import { useState } from 'react'
import { TimelineForm } from '../../components/TimelineForm'
import { TimelineList } from '../../components/TimelineList'
import { TimelineProgress } from '../../components/TimelineProgress'
import { useTimeline } from '../../hooks/useTimeline'
import { TimelineEvent, TimelineStatus } from '../../types/timeline'

const TIME_PERIODS = [
  { label: 'All', value: 'all' },
  { label: 'Upcoming (30 days)', value: 'upcoming' },
  { label: 'Overdue', value: 'overdue' },
]

const STATUSES: TimelineStatus[] = [
  'Not Started',
  'In Progress',
  'Completed',
  'Overdue',
]

export default function TimelinePage() {
  const {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    updateStatus,
    getUpcomingEvents,
    getOverdueEvents,
    getProgress,
    canComplete,
  } = useTimeline()

  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | undefined>()
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState<TimelineStatus | 'All'>(
    'All'
  )

  const handleSubmit = (eventData: Omit<TimelineEvent, 'id'>) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData)
    } else {
      addEvent(eventData)
    }
    setShowForm(false)
    setEditingEvent(undefined)
  }

  const handleEdit = (event: TimelineEvent) => {
    setEditingEvent(event)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this event?')) {
      deleteEvent(id)
    }
  }

  const handleStatusChange = (id: string, status: TimelineStatus) => {
    if (status === 'Completed' && !canComplete(id)) {
      alert('Cannot complete this event until its dependencies are completed.')
      return
    }
    updateStatus(id, status)
  }

  const filteredEvents = (() => {
    let filtered = events

    // Filter by time period
    if (selectedPeriod === 'upcoming') {
      filtered = getUpcomingEvents()
    } else if (selectedPeriod === 'overdue') {
      filtered = getOverdueEvents()
    }

    // Filter by status
    if (selectedStatus !== 'All') {
      filtered = filtered.filter((event) => event.status === selectedStatus)
    }

    // Sort by due date
    return filtered.sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
  })()

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Timeline</h1>
            <TimelineProgress progress={getProgress()} />
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => {
                setEditingEvent(undefined)
                setShowForm(true)
              }}
              className="btn-primary">
              Add Event
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <select
            className="input max-w-xs"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}>
            {TIME_PERIODS.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>

          <select
            className="input max-w-xs"
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as TimelineStatus | 'All')
            }>
            <option value="All">All Statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <TimelineList
            events={filteredEvents}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />

          {filteredEvents.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No events found. Click &quot;Add Event&quot; to get started!
            </p>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h2>
            <TimelineForm
              event={editingEvent}
              events={events}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false)
                setEditingEvent(undefined)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
