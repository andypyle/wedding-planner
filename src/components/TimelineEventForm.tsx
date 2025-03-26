import { TimelineEvent } from '@/types/timeline'
import { useState } from 'react'

interface TimelineEventFormProps {
  event?: TimelineEvent
  onSubmit: (formData: {
    title: string
    description: string
    start_time: string
    end_time: string
    location: string
    vendor_name: string
    vendor_contact: string
    notes: string
  }) => Promise<void>
  onCancel: () => void
  loading: boolean
}

export default function TimelineEventForm({
  event,
  onSubmit,
  onCancel,
  loading,
}: TimelineEventFormProps) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    start_time: event?.start_time || '',
    end_time: event?.end_time || '',
    location: event?.location || '',
    vendor_name: event?.vendor_name || '',
    vendor_contact: event?.vendor_contact || '',
    notes: event?.notes || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="label">
          Event Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="label">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="input"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_time" className="label">
            Start Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            id="start_time"
            value={formData.start_time}
            onChange={(e) =>
              setFormData({ ...formData, start_time: e.target.value })
            }
            className="input"
            required
          />
        </div>

        <div>
          <label htmlFor="end_time" className="label">
            End Time
          </label>
          <input
            type="time"
            id="end_time"
            value={formData.end_time}
            onChange={(e) =>
              setFormData({ ...formData, end_time: e.target.value })
            }
            className="input"
          />
        </div>
      </div>

      <div>
        <label htmlFor="location" className="label">
          Location
        </label>
        <input
          type="text"
          id="location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          className="input"
        />
      </div>

      <div>
        <label htmlFor="vendor_name" className="label">
          Vendor Name
        </label>
        <input
          type="text"
          id="vendor_name"
          value={formData.vendor_name}
          onChange={(e) =>
            setFormData({ ...formData, vendor_name: e.target.value })
          }
          className="input"
        />
      </div>

      <div>
        <label htmlFor="vendor_contact" className="label">
          Vendor Contact
        </label>
        <input
          type="text"
          id="vendor_contact"
          value={formData.vendor_contact}
          onChange={(e) =>
            setFormData({ ...formData, vendor_contact: e.target.value })
          }
          className="input"
        />
      </div>

      <div>
        <label htmlFor="notes" className="label">
          Notes
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="input"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-70">
          {loading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  )
}
