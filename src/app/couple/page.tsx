'use client'

import { useState } from 'react'

export default function CouplePage() {
  const [couple, setCouple] = useState({
    partner1: {
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '(555) 123-4567',
    },
    partner2: {
      name: 'John Smith',
      email: 'john@example.com',
      phone: '(555) 987-6543',
    },
    weddingDate: '2025-06-15',
    venue: 'Lakeside Gardens',
    guestCount: 150,
    story:
      'We met at a coffee shop in the fall of 2020 and have been inseparable ever since.',
  })

  const handlePartner1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCouple({
      ...couple,
      partner1: {
        ...couple.partner1,
        [name]: value,
      },
    })
  }

  const handlePartner2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCouple({
      ...couple,
      partner2: {
        ...couple.partner2,
        [name]: value,
      },
    })
  }

  const handleCoupleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setCouple({
      ...couple,
      [name]: value,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-earth-800">
          Couple Profile
        </h1>
        <p className="mt-1 text-sm text-earth-600">
          Information about you and your partner
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-medium mb-4">Partner 1</h2>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary overflow-hidden border-2 border-earth-300 flex items-center justify-center text-white font-bold text-xl">
              {couple.partner1.name
                .split(' ')
                .map((name) => name[0])
                .join('')}
            </div>
            <div>
              <h3 className="font-medium">{couple.partner1.name}</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="partner1-name" className="label">
                Full Name
              </label>
              <input
                type="text"
                id="partner1-name"
                name="name"
                className="input"
                value={couple.partner1.name}
                onChange={handlePartner1Change}
              />
            </div>

            <div>
              <label htmlFor="partner1-email" className="label">
                Email Address
              </label>
              <input
                type="email"
                id="partner1-email"
                name="email"
                className="input"
                value={couple.partner1.email}
                onChange={handlePartner1Change}
              />
            </div>

            <div>
              <label htmlFor="partner1-phone" className="label">
                Phone Number
              </label>
              <input
                type="tel"
                id="partner1-phone"
                name="phone"
                className="input"
                value={couple.partner1.phone}
                onChange={handlePartner1Change}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-medium mb-4">Partner 2</h2>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-secondary overflow-hidden border-2 border-earth-300 flex items-center justify-center text-earth-800 font-bold text-xl">
              {couple.partner2.name
                .split(' ')
                .map((name) => name[0])
                .join('')}
            </div>
            <div>
              <h3 className="font-medium">{couple.partner2.name}</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="partner2-name" className="label">
                Full Name
              </label>
              <input
                type="text"
                id="partner2-name"
                name="name"
                className="input"
                value={couple.partner2.name}
                onChange={handlePartner2Change}
              />
            </div>

            <div>
              <label htmlFor="partner2-email" className="label">
                Email Address
              </label>
              <input
                type="email"
                id="partner2-email"
                name="email"
                className="input"
                value={couple.partner2.email}
                onChange={handlePartner2Change}
              />
            </div>

            <div>
              <label htmlFor="partner2-phone" className="label">
                Phone Number
              </label>
              <input
                type="tel"
                id="partner2-phone"
                name="phone"
                className="input"
                value={couple.partner2.phone}
                onChange={handlePartner2Change}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-medium mb-4">Wedding Details</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="weddingDate" className="label">
              Wedding Date
            </label>
            <input
              type="date"
              id="weddingDate"
              name="weddingDate"
              className="input"
              value={couple.weddingDate}
              onChange={handleCoupleChange}
            />
          </div>

          <div>
            <label htmlFor="venue" className="label">
              Venue
            </label>
            <input
              type="text"
              id="venue"
              name="venue"
              className="input"
              value={couple.venue}
              onChange={handleCoupleChange}
            />
          </div>

          <div>
            <label htmlFor="guestCount" className="label">
              Estimated Guest Count
            </label>
            <input
              type="number"
              id="guestCount"
              name="guestCount"
              className="input"
              value={couple.guestCount}
              onChange={handleCoupleChange}
            />
          </div>

          <div>
            <label htmlFor="story" className="label">
              Your Story
            </label>
            <textarea
              id="story"
              name="story"
              rows={4}
              className="input"
              value={couple.story}
              onChange={handleCoupleChange}
            />
          </div>

          <div className="pt-4">
            <button className="btn-primary">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}
