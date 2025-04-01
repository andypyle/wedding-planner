'use client'

import { ImageUpload } from '@/components/ImageUpload/ImageUpload'
import { createClient } from '@/lib/supabase/client'
import { memo, useState } from 'react'
import { ProfileFormProps } from './types'

interface FormData {
  partner1_name: string
  partner2_name: string
  wedding_date: string
  wedding_location: string
  wedding_venue: string
  total_budget: number
  avatar_url?: string | null
}

export const ProfileForm = memo(function ProfileForm({
  profile,
  user,
  onSubmit,
}: ProfileFormProps) {
  const [formData, setFormData] = useState<FormData>({
    partner1_name: profile.partner1_name || '',
    partner2_name: profile.partner2_name || '',
    wedding_date: profile.wedding_date || '',
    wedding_location: profile.wedding_location || '',
    wedding_venue: profile.wedding_venue || '',
    total_budget: profile.total_budget || 0,
    avatar_url: profile.avatar_url || null,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = async (filePath: string) => {
    // Get the session to access the auth token
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('No active session')
    }

    const updatedFormData = { ...formData, avatar_url: filePath }
    setFormData(updatedFormData)
    // Automatically save when image is uploaded
    onSubmit(updatedFormData, true)
  }

  return (
    <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Photo Section */}
      <div>
        <h3 className="text-lg font-medium text-slate-900">Profile Photo</h3>
        <p className="mt-1 text-sm text-slate-500">
          Upload a photo to personalize your profile
        </p>
        <div className="mt-4">
          <ImageUpload
            currentImageUrl={formData.avatar_url}
            onUploadComplete={handleImageUpload}
            bucket="avatars"
            folder="profile"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Rest of the form fields */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="partner1_name"
            className="block text-sm font-medium text-slate-700">
            Partner 1 Name
          </label>
          <input
            type="text"
            id="partner1_name"
            value={formData.partner1_name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                partner1_name: e.target.value,
              }))
            }
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor="partner2_name"
            className="block text-sm font-medium text-slate-700">
            Partner 2 Name
          </label>
          <input
            type="text"
            id="partner2_name"
            value={formData.partner2_name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                partner2_name: e.target.value,
              }))
            }
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor="wedding_date"
            className="block text-sm font-medium text-slate-700">
            Wedding Date
          </label>
          <input
            type="date"
            id="wedding_date"
            value={formData.wedding_date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, wedding_date: e.target.value }))
            }
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor="wedding_location"
            className="block text-sm font-medium text-slate-700">
            Wedding Location
          </label>
          <input
            type="text"
            id="wedding_location"
            value={formData.wedding_location}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                wedding_location: e.target.value,
              }))
            }
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor="wedding_venue"
            className="block text-sm font-medium text-slate-700">
            Wedding Venue
          </label>
          <input
            type="text"
            id="wedding_venue"
            value={formData.wedding_venue}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                wedding_venue: e.target.value,
              }))
            }
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor="total_budget"
            className="block text-sm font-medium text-slate-700">
            Total Budget
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-slate-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="total_budget"
              value={formData.total_budget}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  total_budget: parseFloat(e.target.value),
                }))
              }
              disabled={isSubmitting}
              className="mt-1 block w-full pl-7 rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            isSubmitting ? 'relative' : ''
          }`}>
          {isSubmitting ? (
            <>
              <span className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              <span className="opacity-0">Save Changes</span>
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  )
})
