'use client'

import { TimelineEvent, TimelineStatus } from '../types/timeline'

interface TimelineListProps {
  events: TimelineEvent[]
  onEdit: (event: TimelineEvent) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: TimelineStatus) => void
}

const STATUS_COLORS = {
  'Not Started': 'bg-gray-100 text-gray-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Overdue: 'bg-red-100 text-red-800',
}

const PRIORITY_COLORS = {
  Low: 'bg-gray-100 text-gray-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-red-100 text-red-800',
}

export function TimelineList({
  events,
  onEdit,
  onDelete,
  onStatusChange,
}: TimelineListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Event
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {events.map((event) => (
            <tr key={event.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {event.title}
                </div>
                {event.description && (
                  <div className="text-sm text-gray-500">
                    {event.description}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-gray-800">
                  {event.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(event.dueDate)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={event.status}
                  onChange={(e) =>
                    onStatusChange(event.id, e.target.value as TimelineStatus)
                  }
                  className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${
                    STATUS_COLORS[event.status]
                  }`}>
                  {Object.keys(STATUS_COLORS).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    PRIORITY_COLORS[event.priority]
                  }`}>
                  {event.priority}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(event)}
                    className="text-primary hover:text-primary/80">
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
