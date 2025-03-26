'use client'

import { Guest } from '@/types/guest'

interface GuestCardProps {
  guest: Guest
  onEdit: (guest: Guest) => void
  onDelete: (id: string) => void
}

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  attending: 'bg-green-100 text-green-800',
  not_attending: 'bg-red-100 text-red-800',
}

export function GuestCard({ guest, onEdit, onDelete }: GuestCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-base font-medium text-gray-900">
            {guest.first_name} {guest.last_name}
            {guest.plus_one && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                +1
              </span>
            )}
          </h3>
          {guest.group && (
            <p className="mt-1 text-sm text-gray-500">{guest.group}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              STATUS_COLORS[guest.rsvp_status]
            }`}>
            {guest.rsvp_status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 text-sm">
        <div>
          <span className="text-gray-600">Email</span>
          <p className="font-medium text-gray-900 break-all">{guest.email}</p>
        </div>
        <div>
          <span className="text-gray-600">Phone</span>
          <p className="font-medium text-gray-900">{guest.phone}</p>
        </div>
        {guest.dietary_restrictions && (
          <div>
            <span className="text-gray-600">Dietary</span>
            <p className="font-medium text-gray-900">
              {guest.dietary_restrictions}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-2 border-t border-gray-100">
        <button
          onClick={() => onEdit(guest)}
          className="text-sm text-primary hover:text-primary-dark">
          Edit
        </button>
        <button
          onClick={() => onDelete(guest.id)}
          className="text-sm text-red-600 hover:text-red-900">
          Delete
        </button>
      </div>
    </div>
  )
}
