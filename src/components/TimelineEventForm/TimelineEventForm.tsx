'use client'

import { Button } from '@/components/Button/Button'
import {
  Form,
  FormGroup,
  FormInput,
  FormTextarea,
} from '@/components/Form/Form'
import { useState } from 'react'
import { TimelineEventFormData, TimelineEventFormProps } from './types'

export function TimelineEventForm({
  event,
  onSubmit,
  onCancel,
  loading,
}: TimelineEventFormProps) {
  const [formData, setFormData] = useState<TimelineEventFormData>({
    title: event?.title || '',
    description: event?.description || '',
    start_time: event?.start_time || '',
    end_time: event?.end_time || '',
    location: event?.location || '',
    vendor_name: event?.vendor_name || '',
    vendor_contact: event?.vendor_contact || '',
    notes: event?.notes || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup label="Title" htmlFor="title" required>
        <FormInput
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          required
        />
      </FormGroup>

      <FormGroup label="Description" htmlFor="description">
        <FormTextarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={3}
        />
      </FormGroup>

      <div className="grid grid-cols-2 gap-4">
        <FormGroup label="Start Time" htmlFor="start_time" required>
          <FormInput
            type="time"
            id="start_time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            required
          />
        </FormGroup>

        <FormGroup label="End Time" htmlFor="end_time">
          <FormInput
            type="time"
            id="end_time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </FormGroup>
      </div>

      <FormGroup label="Location" htmlFor="location">
        <FormInput
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </FormGroup>

      <FormGroup label="Vendor Name" htmlFor="vendor_name">
        <FormInput
          type="text"
          id="vendor_name"
          name="vendor_name"
          value={formData.vendor_name}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </FormGroup>

      <FormGroup label="Vendor Contact" htmlFor="vendor_contact">
        <FormInput
          type="text"
          id="vendor_contact"
          name="vendor_contact"
          value={formData.vendor_contact}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </FormGroup>

      <FormGroup label="Notes" htmlFor="notes">
        <FormTextarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={3}
        />
      </FormGroup>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {event ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </Form>
  )
}
