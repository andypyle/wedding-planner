'use client'

import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Profile {
  id: string
  partner1_name: string
  partner2_name: string
  wedding_date: string | null
  wedding_location: string | null
  wedding_venue: string | null
  total_budget: number
  created_at: string
  updated_at: string
}

interface ProfileFormProps {
  profile: Profile
  user: User
}

export default function ProfileForm({ profile, user }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    partner1_name: profile?.partner1_name || '',
    partner2_name: profile?.partner2_name || '',
    wedding_date: profile?.wedding_date || '',
    wedding_location: profile?.wedding_location || '',
    wedding_venue: profile?.wedding_venue || '',
    total_budget: profile?.total_budget || 0,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id)

      if (updateError) {
        throw updateError
      }

      setSuccess(true)
      router.refresh()
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="partner1_name"
              className="block text-sm font-medium text-earth-700">
              Partner 1 Name
            </label>
            <input
              type="text"
              id="partner1_name"
              name="partner1_name"
              value={formData.partner1_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-earth-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="partner2_name"
              className="block text-sm font-medium text-earth-700">
              Partner 2 Name
            </label>
            <input
              type="text"
              id="partner2_name"
              name="partner2_name"
              value={formData.partner2_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-earth-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="wedding_date"
              className="block text-sm font-medium text-earth-700">
              Wedding Date
            </label>
            <input
              type="date"
              id="wedding_date"
              name="wedding_date"
              value={formData.wedding_date}
              onChange={handleChange}
              className="mt-1 block w-full border border-earth-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="wedding_location"
              className="block text-sm font-medium text-earth-700">
              Wedding Location
            </label>
            <input
              type="text"
              id="wedding_location"
              name="wedding_location"
              value={formData.wedding_location || ''}
              onChange={handleChange}
              placeholder="e.g. San Francisco, CA"
              className="mt-1 block w-full border border-earth-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="wedding_venue"
              className="block text-sm font-medium text-earth-700">
              Wedding Venue
            </label>
            <input
              type="text"
              id="wedding_venue"
              name="wedding_venue"
              value={formData.wedding_venue || ''}
              onChange={handleChange}
              placeholder="e.g. Grand Ballroom"
              className="mt-1 block w-full border border-earth-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="total_budget"
              className="block text-sm font-medium text-earth-700">
              Total Budget ($)
            </label>
            <input
              type="number"
              id="total_budget"
              name="total_budget"
              value={formData.total_budget}
              onChange={handleChange}
              min="0"
              step="100"
              className="mt-1 block w-full border border-earth-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
