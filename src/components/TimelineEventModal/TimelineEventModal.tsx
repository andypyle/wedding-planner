'use client'

import { Modal } from '@/components/modal'
import { TimelineEventForm } from '@/components/TimelineEventForm/TimelineEventForm'
import { TimelineEventModalProps } from './types'

export function TimelineEventModal({
  event,
  isOpen,
  onClose,
  onSubmit,
  loading,
}: TimelineEventModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? 'Edit Event' : 'Add Event'}>
      <TimelineEventForm
        event={event}
        onSubmit={onSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  )
}
