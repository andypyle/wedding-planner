'use client'

import { Guest } from '../types/guest'

interface GuestListProps {
  guests: Guest[]
  onEdit: (guest: Guest) => void
  onDelete: (id: string) => void
}

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  attending: 'bg-green-100 text-green-800',
  not_attending: 'bg-red-100 text-red-800',
}

export function GuestList({ guests, onEdit, onDelete }: GuestListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Group
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {guests.map((guest) => (
            <tr key={guest.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {guest.first_name} {guest.last_name}
                  {guest.plus_one && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      +1
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{guest.email}</div>
                <div className="text-sm text-gray-500">{guest.phone}</div>
                {guest.dietary_restrictions && (
                  <div className="text-sm text-gray-500">
                    Dietary: {guest.dietary_restrictions}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{guest.group}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    STATUS_COLORS[guest.rsvp_status]
                  }`}>
                  {guest.rsvp_status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => onEdit(guest)}
                    className="text-primary hover:text-primary-dark">
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(guest.id)}
                    className="text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
