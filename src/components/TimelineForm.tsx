'use client'

import { useState } from 'react'
import {
  TimelineCategory,
  TimelineEvent,
  TimelineStatus,
} from '../types/timeline'

interface TimelineFormProps {
  event?: TimelineEvent
  events: TimelineEvent[]
  onSubmit: (eventData: Omit<TimelineEvent, 'id'>) => void
  onCancel: () => void
}

const CATEGORIES: TimelineCategory[] = [
  'Venue',
  'Catering',
  'Decor',
  'Attire',
  'Photography',
  'Music',
  'Ceremony',
  'Reception',
  'Other',
]

const STATUSES: TimelineStatus[] = [
  'Not Started',
  'In Progress',
  'Completed',
  'Overdue',
]

const PRIORITIES = ['Low', 'Medium', 'High'] as const

export function TimelineForm({
  event,
  events,
  onSubmit,
  onCancel,
}: TimelineFormProps) {
  const [formData, setFormData] = useState<Omit<TimelineEvent, 'id'>>({
    title: event?.title ?? '',
    description: event?.description ?? '',
    category: event?.category ?? 'Other',
    status: event?.status ?? 'Not Started',
    dueDate: event?.dueDate ?? '',
    completedDate: event?.completedDate,
    assignedTo: event?.assignedTo ?? [],
    notes: event?.notes ?? '',
    priority: event?.priority ?? 'Medium',
    dependencies: event?.dependencies ?? [],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDependencyChange = (eventId: string) => {
    setFormData((prev) => {
      const dependencies = prev.dependencies ?? []
      return {
        ...prev,
        dependencies: dependencies.includes(eventId)
          ? dependencies.filter((id) => id !== eventId)
          : [...dependencies, eventId],
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="label">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="input"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="input"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="category" className="label">
            Category *
          </label>
          <select
            id="category"
            name="category"
            required
            className="input"
            value={formData.category}
            onChange={handleChange}>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="label">
            Status *
          </label>
          <select
            id="status"
            name="status"
            required
            className="input"
            value={formData.status}
            onChange={handleChange}>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="label">
            Due Date *
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            required
            className="input"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="priority" className="label">
            Priority *
          </label>
          <select
            id="priority"
            name="priority"
            required
            className="input"
            value={formData.priority}
            onChange={handleChange}>
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="label">Dependencies</label>
          <div className="mt-2 space-y-2">
            {events
              .filter((e) => e.id !== event?.id)
              .map((e) => (
                <label key={e.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.dependencies?.includes(e.id)}
                    onChange={() => handleDependencyChange(e.id)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{e.title}</span>
                </label>
              ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="notes" className="label">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="input"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {event ? 'Update Event' : 'Add Event'}
        </button>
      </div>
    </form>
  )
}
