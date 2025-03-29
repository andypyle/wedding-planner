'use client'

import { GuestListProps, STATUS_COLORS } from './types'

export function GuestList({ guests, onEdit, onDelete }: GuestListProps) {
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      action()
    }
  }

  return (
    <div className="overflow-x-auto">
      <table
        className="min-w-full divide-y divide-slate-200"
        role="table"
        aria-label="Guest list">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Contact
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Group
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {guests.map((guest) => (
            <tr key={guest.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-slate-900">
                  {guest.first_name} {guest.last_name}
                  {guest.plus_one && (
                    <span
                      className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800"
                      aria-label="Plus one">
                      +1
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-900">{guest.email}</div>
                <div className="text-sm text-slate-500">{guest.phone}</div>
                {guest.dietary_restrictions && (
                  <div className="text-sm text-slate-500">
                    Dietary: {guest.dietary_restrictions}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-900">{guest.group_name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    STATUS_COLORS[guest.rsvp_status]
                  }`}
                  role="status"
                  aria-label={`RSVP status: ${guest.rsvp_status}`}>
                  {guest.rsvp_status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => onEdit(guest)}
                    onKeyDown={(e) => handleKeyDown(e, () => onEdit(guest))}
                    className="text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                    aria-label={`Edit ${guest.first_name} ${guest.last_name}`}>
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(guest.id)}
                    onKeyDown={(e) =>
                      handleKeyDown(e, () => onDelete(guest.id))
                    }
                    className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    aria-label={`Delete ${guest.first_name} ${guest.last_name}`}>
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
