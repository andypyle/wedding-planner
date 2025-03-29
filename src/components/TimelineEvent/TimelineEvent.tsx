'use client'

import { TimelineEventProps } from './types'

export function TimelineEvent({ event, onEdit, onDelete }: TimelineEventProps) {
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      action()
    }
  }

  return (
    <article
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      role="article"
      aria-label={`Timeline event: ${event.title}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-slate-900">{event.title}</h3>
          {event.description && (
            <p className="mt-1 text-sm text-slate-500">{event.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(event)}
            onKeyDown={(e) => handleKeyDown(e, () => onEdit(event))}
            className="text-slate-600 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            aria-label={`Edit ${event.title}`}>
            Edit
          </button>
          <button
            onClick={() => onDelete(event.id)}
            onKeyDown={(e) => handleKeyDown(e, () => onDelete(event.id))}
            className="text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            aria-label={`Delete ${event.title}`}>
            Delete
          </button>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-medium text-slate-500">Time</dt>
          <dd className="mt-1 text-sm text-slate-900">
            <time dateTime={event.start_time}>
              {formatTime(event.start_time)}
              {event.end_time && (
                <>
                  {' - '}
                  <time dateTime={event.end_time}>
                    {formatTime(event.end_time)}
                  </time>
                </>
              )}
            </time>
          </dd>
        </div>

        {event.location && (
          <div>
            <dt className="text-sm font-medium text-slate-500">Location</dt>
            <dd className="mt-1 text-sm text-slate-900">{event.location}</dd>
          </div>
        )}

        {event.vendor_name && (
          <div>
            <dt className="text-sm font-medium text-slate-500">Vendor</dt>
            <dd className="mt-1 text-sm text-slate-900">
              {event.vendor_name}
              {event.vendor_contact && (
                <div className="text-xs text-slate-500">
                  {event.vendor_contact}
                </div>
              )}
            </dd>
          </div>
        )}

        {event.notes && (
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-slate-500">Notes</dt>
            <dd className="mt-1 text-sm text-slate-900">{event.notes}</dd>
          </div>
        )}
      </dl>
    </article>
  )
}
