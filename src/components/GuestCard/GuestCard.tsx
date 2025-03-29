'use client'

import { GuestCardProps } from './types'

export function GuestCard({ guest, onEdit, onDelete }: GuestCardProps) {
  const handleEdit = () => onEdit(guest)
  const handleDelete = () => onDelete(guest.id)
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      action()
    }
  }

  const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800',
    attending: 'bg-green-100 text-green-800',
    not_attending: 'bg-red-100 text-red-800',
  } as const

  return (
    <div
      className="bg-white p-4 rounded-lg border border-slate-200 space-y-3"
      role="article"
      aria-label={`Guest card for ${guest.first_name} ${guest.last_name}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-base font-medium text-slate-900">
            {guest.first_name} {guest.last_name}
            {guest.plus_one && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                +1
              </span>
            )}
          </h3>
          {guest.group_name && (
            <p className="mt-1 text-sm text-slate-500">{guest.group_name}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              STATUS_COLORS[guest.rsvp_status]
            }`}
            role="status"
            aria-label={`RSVP status: ${guest.rsvp_status}`}>
            {guest.rsvp_status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 text-sm">
        <div>
          <span className="text-slate-600">Email</span>
          <p className="font-medium text-slate-900 break-all">{guest.email}</p>
        </div>
        <div>
          <span className="text-slate-600">Phone</span>
          <p className="font-medium text-slate-900">{guest.phone}</p>
        </div>
        {guest.dietary_restrictions && (
          <div>
            <span className="text-slate-600">Dietary Restrictions</span>
            <p className="font-medium text-slate-900">
              {guest.dietary_restrictions}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-2 border-t border-slate-100">
        <button
          onClick={handleEdit}
          onKeyDown={(e) => handleKeyDown(e, handleEdit)}
          className="text-sm text-primary hover:text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
          aria-label={`Edit ${guest.first_name} ${guest.last_name}`}
          tabIndex={0}>
          Edit
        </button>
        <button
          onClick={handleDelete}
          onKeyDown={(e) => handleKeyDown(e, handleDelete)}
          className="text-sm text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded px-2 py-1"
          aria-label={`Delete ${guest.first_name} ${guest.last_name}`}
          tabIndex={0}>
          Delete
        </button>
      </div>
    </div>
  )
}
