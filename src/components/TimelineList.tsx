'use client'

import { TimelineEvent } from '../types/timeline'

interface TimelineListProps {
  events: TimelineEvent[]
  onEdit: (event: TimelineEvent) => void
  onDelete: (id: string) => void
}

export function TimelineList({ events, onEdit, onDelete }: TimelineListProps) {
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Event
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Vendor
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
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
                {formatTime(event.start_time)}
                {event.end_time && ` - ${formatTime(event.end_time)}`}
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
                    className="text-slate-600 hover:text-slate-800">
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(event.id)}
                    className="text-red-500 hover:text-red-600">
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
