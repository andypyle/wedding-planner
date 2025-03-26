'use client'

import { useState } from 'react'
import { Guest, GuestStatus } from '../types/guest'

interface GuestFormProps {
  guest?: Guest
  onSubmit: (
    guestData: Omit<Guest, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => void
  onCancel: () => void
  isSubmitting?: boolean
}

const GUEST_STATUSES: GuestStatus[] = ['pending', 'attending', 'not_attending']

export function GuestForm({
  guest,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: GuestFormProps) {
  const [formData, setFormData] = useState<
    Omit<Guest, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  >({
    first_name: guest?.first_name || '',
    last_name: guest?.last_name || '',
    email: guest?.email || '',
    phone: guest?.phone || '',
    group: guest?.group || '',
    rsvp_status: guest?.rsvp_status || 'pending',
    dietary_restrictions: guest?.dietary_restrictions || '',
    plus_one: guest?.plus_one || false,
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
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="first_name" className="label">
              First Name *
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              required
              className="input"
              value={formData.first_name}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="last_name" className="label">
              Last Name *
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              required
              className="input"
              value={formData.last_name}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="input"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="phone" className="label">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="input"
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="group" className="label">
              Group
            </label>
            <input
              type="text"
              id="group"
              name="group"
              className="input"
              value={formData.group}
              onChange={handleChange}
              placeholder="e.g., Family, College Friends"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="rsvp_status" className="label">
              RSVP Status *
            </label>
            <select
              id="rsvp_status"
              name="rsvp_status"
              required
              className="input"
              value={formData.rsvp_status}
              onChange={handleChange}
              disabled={isSubmitting}>
              {GUEST_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="dietary_restrictions" className="label">
              Dietary Restrictions
            </label>
            <input
              type="text"
              id="dietary_restrictions"
              name="dietary_restrictions"
              className="input"
              value={formData.dietary_restrictions}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="label">Plus One</label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="plus_one"
                  checked={formData.plus_one}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  disabled={isSubmitting}
                />
                <span className="ml-2 text-sm text-gray-700">
                  This guest has a plus one
                </span>
              </label>
            </div>
          </div>

          <div className="sm:col-span-2">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary"
                disabled={isSubmitting}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}>
                {isSubmitting
                  ? 'Saving...'
                  : guest
                  ? 'Update Guest'
                  : 'Add Guest'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
