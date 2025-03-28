'use client'

import { updateGuest } from '@/app/actions/guests'
import { Modal } from '@/components/Modal'
import { Guest } from '@/types/guest'
import { useState } from 'react'

interface EditGuestModalProps {
  guest: Guest
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function EditGuestModal({
  guest,
  isOpen,
  onClose,
  onSuccess,
}: EditGuestModalProps) {
  const [formData, setFormData] = useState(guest)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await updateGuest(formData)
      onSuccess()
      onClose()
    } catch (err) {
      setError('Failed to update guest')
      console.error('Error updating guest:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Guest">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-slate-700">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-slate-700">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
              required
            />
          </div>
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
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            required
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
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            required
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
            value={formData.group}
            onChange={(e) =>
              setFormData({ ...formData, group: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="rsvp_status"
            className="block text-sm font-medium text-slate-700">
            RSVP Status
          </label>
          <select
            id="rsvp_status"
            value={formData.rsvp_status}
            onChange={(e) =>
              setFormData({
                ...formData,
                rsvp_status: e.target.value as Guest['rsvp_status'],
              })
            }
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            required>
            <option value="pending">Pending</option>
            <option value="attending">Attending</option>
            <option value="not_attending">Not Attending</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="dietary_restrictions"
            className="block text-sm font-medium text-slate-700">
            Dietary Restrictions
          </label>
          <input
            type="text"
            id="dietary_restrictions"
            value={formData.dietary_restrictions || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                dietary_restrictions: e.target.value,
              })
            }
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            placeholder="None"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="plus_one"
            checked={formData.plus_one}
            onChange={(e) =>
              setFormData({ ...formData, plus_one: e.target.checked })
            }
            className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
          />
          <label
            htmlFor="plus_one"
            className="ml-2 block text-sm text-slate-700">
            Allow Plus One
          </label>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-70">
            {isSubmitting ? 'Updating...' : 'Update Guest'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
