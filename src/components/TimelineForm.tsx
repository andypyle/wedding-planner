'use client'

import { useState } from 'react'
import { TimelineEvent } from '../types/timeline'

interface TimelineFormProps {
  event?: TimelineEvent
  onSubmit: (
    eventData: Omit<TimelineEvent, 'id' | 'created_at' | 'updated_at'>
  ) => void
  onCancel: () => void
  loading?: boolean
}

export default function TimelineForm({
  event,
  onSubmit,
  onCancel,
  loading = false,
}: TimelineFormProps) {
  const [formData, setFormData] = useState<
    Omit<TimelineEvent, 'id' | 'created_at' | 'updated_at'>
  >({
    title: event?.title ?? '',
    description: event?.description ?? '',
    start_time: event?.start_time ?? '',
    end_time: event?.end_time ?? '',
    location: event?.location ?? '',
    vendor_name: event?.vendor_name ?? '',
    vendor_contact: event?.vendor_contact ?? '',
    notes: event?.notes ?? '',
    user_id: event?.user_id ?? '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-slate-700">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="start_time"
            className="block text-sm font-medium text-slate-700">
            Start Time *
          </label>
          <input
            type="time"
            id="start_time"
            name="start_time"
            required
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            value={formData.start_time}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="end_time"
            className="block text-sm font-medium text-slate-700">
            End Time
          </label>
          <input
            type="time"
            id="end_time"
            name="end_time"
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            value={formData.end_time ?? ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-slate-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            value={formData.location ?? ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="vendor_name"
            className="block text-sm font-medium text-slate-700">
            Vendor Name
          </label>
          <input
            type="text"
            id="vendor_name"
            name="vendor_name"
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            value={formData.vendor_name ?? ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="vendor_contact"
            className="block text-sm font-medium text-slate-700">
            Vendor Contact
          </label>
          <input
            type="text"
            id="vendor_contact"
            name="vendor_contact"
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            value={formData.vendor_contact ?? ''}
            onChange={handleChange}
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-slate-700">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            value={formData.notes ?? ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          disabled={loading}>
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          disabled={loading}>
          {loading ? 'Saving...' : event ? 'Update Event' : 'Add Event'}
        </button>
      </div>
    </form>
  )
}
