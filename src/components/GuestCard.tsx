'use client'

import { Guest } from '../types/guest'

interface GuestCardProps {
  guest: Guest
  onEdit: (guest: Guest) => void
  onDelete: (id: string) => void
}

export function GuestCard({ guest, onEdit, onDelete }: GuestCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {guest.first_name} {guest.last_name}
              {guest.plus_one && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/20 text-gray-800">
                  +1
                </span>
              )}
            </h3>
            {guest.group_name && (
              <p className="mt-1 text-sm text-gray-500">{guest.group_name}</p>
            )}
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              guest.rsvp_status === 'Confirmed'
                ? 'bg-green-100 text-green-800'
                : guest.rsvp_status === 'Declined'
                ? 'bg-red-100 text-red-800'
                : guest.rsvp_status === 'Maybe'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
            {guest.rsvp_status}
          </span>
        </div>
      </div>
      <div className="px-4 py-4 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          {(guest.email || guest.phone) && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Contact</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {guest.email && (
                  <div>
                    <a
                      href={`mailto:${guest.email}`}
                      className="text-primary hover:underline">
                      {guest.email}
                    </a>
                  </div>
                )}
                {guest.phone && <div>{guest.phone}</div>}
              </dd>
            </div>
          )}

          {(guest.address || guest.city || guest.state || guest.zip) && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {guest.address && <div>{guest.address}</div>}
                {(guest.city || guest.state || guest.zip) && (
                  <div>
                    {guest.city && <span>{guest.city}</span>}
                    {guest.city && (guest.state || guest.zip) && (
                      <span>, </span>
                    )}
                    {guest.state && <span>{guest.state}</span>}
                    {guest.state && guest.zip && <span> </span>}
                    {guest.zip && <span>{guest.zip}</span>}
                  </div>
                )}
              </dd>
            </div>
          )}

          {guest.meal_choice && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Meal Choice</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {guest.meal_choice}
              </dd>
            </div>
          )}

          {guest.plus_one && guest.plus_one_name && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Plus One</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div>{guest.plus_one_name}</div>
                {guest.plus_one_meal_choice && (
                  <div className="text-gray-500">
                    Meal: {guest.plus_one_meal_choice}
                  </div>
                )}
              </dd>
            </div>
          )}

          {guest.notes && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Notes</dt>
              <dd className="mt-1 text-sm text-gray-900">{guest.notes}</dd>
            </div>
          )}
        </dl>
      </div>
      <div className="px-4 py-4 sm:px-6">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(guest)}
            className="text-primary hover:text-primary/80">
            Edit
          </button>
          <button
            onClick={() => onDelete(guest.id)}
            className="text-red-500 hover:text-red-600">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
