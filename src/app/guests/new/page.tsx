'use client'

import { createGuest } from '@/app/actions/guests'
import { Guest } from '@/types/guest'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NewGuestPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const guestData: Omit<Guest, 'id' | 'created_at' | 'updated_at'> = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      group: formData.get('group') as string,
      rsvp_status: 'pending',
      dietary_restrictions: formData.get('dietary_restrictions') as string,
      plus_one: formData.get('plus_one') === 'true',
    }

    try {
      await createGuest(guestData)
      router.push('/guests')
    } catch (err) {
      setError('Failed to create guest')
      console.error('Error creating guest:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-earth-800">Add New Guest</h1>
        <p className="mt-1 text-sm text-earth-600">
          Add a new guest to your wedding list
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-earth-700">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              className="mt-1 block w-full rounded-md border-earth-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-earth-700">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              className="mt-1 block w-full rounded-md border-earth-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-earth-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 block w-full rounded-md border-earth-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-earth-700">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="mt-1 block w-full rounded-md border-earth-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="group"
            className="block text-sm font-medium text-earth-700">
            Group
          </label>
          <input
            type="text"
            id="group"
            name="group"
            className="mt-1 block w-full rounded-md border-earth-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="dietary_restrictions"
            className="block text-sm font-medium text-earth-700">
            Dietary Restrictions
          </label>
          <input
            type="text"
            id="dietary_restrictions"
            name="dietary_restrictions"
            className="mt-1 block w-full rounded-md border-earth-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="None"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="plus_one"
            name="plus_one"
            value="true"
            className="h-4 w-4 rounded border-earth-300 text-primary focus:ring-primary"
          />
          <label
            htmlFor="plus_one"
            className="ml-2 block text-sm text-earth-700">
            Allow Plus One
          </label>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-secondary">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary">
            {isSubmitting ? 'Adding...' : 'Add Guest'}
          </button>
        </div>
      </form>
    </div>
  )
}
