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
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-slate-700">
              First Name *
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              required
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
              value={formData.first_name}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-slate-700">
              Last Name *
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              required
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
              value={formData.last_name}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-slate-700">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="group"
              className="block text-sm font-medium text-slate-700">
              Group
            </label>
            <input
              type="text"
              id="group"
              name="group"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
              value={formData.group}
              onChange={handleChange}
              placeholder="e.g., Family, College Friends"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="rsvp_status"
              className="block text-sm font-medium text-slate-700">
              RSVP Status *
            </label>
            <select
              id="rsvp_status"
              name="rsvp_status"
              required
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
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
            <label
              htmlFor="dietary_restrictions"
              className="block text-sm font-medium text-slate-700">
              Dietary Restrictions
            </label>
            <input
              type="text"
              id="dietary_restrictions"
              name="dietary_restrictions"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
              value={formData.dietary_restrictions}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              Plus One
            </label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="plus_one"
                  checked={formData.plus_one}
                  onChange={handleChange}
                  className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                  disabled={isSubmitting}
                />
                <span className="ml-2 text-sm text-slate-700">
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
                className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                disabled={isSubmitting}>
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
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
