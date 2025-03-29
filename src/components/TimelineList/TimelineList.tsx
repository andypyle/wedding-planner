'use client'

import { TimelineListProps } from './types'

export function TimelineList({ events, onEdit, onDelete }: TimelineListProps) {
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
    <div className="overflow-x-auto">
      <table
        className="min-w-full divide-y divide-slate-200"
        role="table"
        aria-label="Timeline events">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Event
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Time
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Location
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Vendor
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {events.map((event) => (
            <tr key={event.id} className="hover:bg-slate-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-slate-900">
                  {event.title}
                </div>
                {event.description && (
                  <div className="text-sm text-slate-500">
                    {event.description}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
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
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {event.location}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {event.vendor_name && (
                  <div>
                    {event.vendor_name}
                    {event.vendor_contact && (
                      <div className="text-xs text-slate-400">
                        {event.vendor_contact}
                      </div>
                    )}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(event)}
                    onKeyDown={(e) => handleKeyDown(e, () => onEdit(event))}
                    className="text-slate-600 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                    aria-label={`Edit ${event.title}`}>
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(event.id)}
                    onKeyDown={(e) =>
                      handleKeyDown(e, () => onDelete(event.id))
                    }
                    className="text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    aria-label={`Delete ${event.title}`}>
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
