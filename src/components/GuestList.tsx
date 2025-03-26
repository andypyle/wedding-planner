'use client'

import { Guest } from '../types/guest'

interface GuestListProps {
  guests: Guest[]
  onEdit: (guest: Guest) => void
  onDelete: (id: string) => void
}

export function GuestList({ guests, onEdit, onDelete }: GuestListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Address
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              RSVP Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Plus One
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Group
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {guests.map((guest) => (
            <tr key={guest.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {guest.first_name} {guest.last_name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
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
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
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
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
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
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {guest.plus_one && (
                  <div className="text-sm text-gray-900">
                    <div>{guest.plus_one_name}</div>
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{guest.group_name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(guest)}
                  className="text-primary hover:text-primary/80 mr-4">
                  Edit
                </button>
                <button
                  onClick={() => onDelete(guest.id)}
                  className="text-red-500 hover:text-red-600">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
