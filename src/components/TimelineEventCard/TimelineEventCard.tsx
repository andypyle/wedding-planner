'use client'

import { Button } from '@/components/Button/Button'
import { Card, CardBody, CardHeader } from '@/components/Card/Card'
import { TimelineEventCardProps } from './types'

export function TimelineEventCard({
  event,
  onEdit,
  onDelete,
  formatTime,
}: TimelineEventCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      action()
    }
  }

  return (
    <Card variant="bordered">
      <CardHeader className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-slate-800">{event.title}</h3>
          <p className="text-sm text-slate-600">
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
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(event)}
            onKeyDown={(e) => handleKeyDown(e, () => onEdit(event))}
            aria-label={`Edit ${event.title}`}>
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(event.id)}
            onKeyDown={(e) => handleKeyDown(e, () => onDelete(event.id))}
            className="text-red-600 hover:text-red-700"
            aria-label={`Delete ${event.title}`}>
            Delete
          </Button>
        </div>
      </CardHeader>

      <CardBody>
        {event.description && (
          <p className="text-slate-700">{event.description}</p>
        )}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {event.location && (
            <div>
              <h4 className="text-sm font-medium text-slate-600">Location</h4>
              <p className="mt-1 text-slate-700">{event.location}</p>
            </div>
          )}

          {event.vendor_name && (
            <div>
              <h4 className="text-sm font-medium text-slate-600">Vendor</h4>
              <p className="mt-1 text-slate-700">{event.vendor_name}</p>
            </div>
          )}

          {event.vendor_contact && (
            <div>
              <h4 className="text-sm font-medium text-slate-600">
                Vendor Contact
              </h4>
              <p className="mt-1 text-slate-700">{event.vendor_contact}</p>
            </div>
          )}

          {event.notes && (
            <div className="md:col-span-2">
              <h4 className="text-sm font-medium text-slate-600">Notes</h4>
              <p className="mt-1 text-slate-700">{event.notes}</p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}
