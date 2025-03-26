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

const GUEST_STATUSES: GuestStatus[] = [
  'Not Sent',
  'Invited',
  'Confirmed',
  'Declined',
  'Maybe',
]

export function GuestForm({
  guest,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: GuestFormProps) {
  const [formData, setFormData] = useState<
    Omit<Guest, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  >({
    first_name: guest?.first_name ?? '',
    last_name: guest?.last_name ?? '',
    email: guest?.email ?? '',
    phone: guest?.phone ?? '',
    address: guest?.address ?? '',
    city: guest?.city ?? '',
    state: guest?.state ?? '',
    zip: guest?.zip ?? '',
    rsvp_status: guest?.rsvp_status ?? 'Not Sent',
    meal_choice: guest?.meal_choice ?? '',
    plus_one: guest?.plus_one ?? false,
    plus_one_name: guest?.plus_one_name ?? '',
    plus_one_meal_choice: guest?.plus_one_meal_choice ?? '',
    group_name: guest?.group_name ?? '',
    notes: guest?.notes ?? '',
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
          <label htmlFor="address" className="label">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className="input"
            value={formData.address}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="city" className="label">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            className="input"
            value={formData.city}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="state" className="label">
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            className="input"
            value={formData.state}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="zip" className="label">
            ZIP Code
          </label>
          <input
            type="text"
            id="zip"
            name="zip"
            className="input"
            value={formData.zip}
            onChange={handleChange}
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

        <div>
          <label htmlFor="meal_choice" className="label">
            Meal Choice
          </label>
          <input
            type="text"
            id="meal_choice"
            name="meal_choice"
            className="input"
            value={formData.meal_choice}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="group_name" className="label">
            Group
          </label>
          <input
            type="text"
            id="group_name"
            name="group_name"
            className="input"
            value={formData.group_name}
            onChange={handleChange}
            placeholder="e.g., Family, College Friends"
            disabled={isSubmitting}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="plus_one"
              checked={formData.plus_one}
              onChange={handleChange}
              className="rounded border-gray-300 text-primary focus:ring-primary"
              disabled={isSubmitting}
            />
            <span className="text-sm text-gray-700">Plus One</span>
          </label>
        </div>

        {formData.plus_one && (
          <>
            <div>
              <label htmlFor="plus_one_name" className="label">
                Plus One Name
              </label>
              <input
                type="text"
                id="plus_one_name"
                name="plus_one_name"
                className="input"
                value={formData.plus_one_name}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="plus_one_meal_choice" className="label">
                Plus One Meal Choice
              </label>
              <input
                type="text"
                id="plus_one_meal_choice"
                name="plus_one_meal_choice"
                className="input"
                value={formData.plus_one_meal_choice}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </>
        )}

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
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : guest ? 'Update Guest' : 'Add Guest'}
        </button>
      </div>
    </form>
  )
}
