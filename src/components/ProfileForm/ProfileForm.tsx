'use client'

import { useState } from 'react'
import { ProfileFormProps } from './types'

export function ProfileForm({
  profile,
  user,
  onSubmit,
  loading,
}: ProfileFormProps) {
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

  return (
    <div>
      <form className="space-y-6">
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
              name="partner1_name"
              value={formData.partner1_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
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
              name="partner2_name"
              value={formData.partner2_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
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
              name="wedding_date"
              value={formData.wedding_date}
              onChange={handleChange}
              className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
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
              name="wedding_location"
              value={formData.wedding_location || ''}
              onChange={handleChange}
              placeholder="e.g. San Francisco, CA"
              className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
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
              name="wedding_venue"
              value={formData.wedding_venue || ''}
              onChange={handleChange}
              placeholder="e.g. Grand Ballroom"
              className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="total_budget"
              className="block text-sm font-medium text-slate-700">
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
              className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
            />
          </div>
        </div>
      </form>
    </div>
  )
}
