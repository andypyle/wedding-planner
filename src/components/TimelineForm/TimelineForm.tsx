'use client'

import { Button } from '@/components/Button/Button'
import {
  Form,
  FormGroup,
  FormInput,
  FormTextarea,
} from '@/components/Form/Form'
import { Grid, GridItem } from '@/components/Grid/Grid'
import { useState } from 'react'
import { TimelineFormData, TimelineFormProps } from './types'

export function TimelineForm({
  event,
  onSubmit,
  onCancel,
  loading = false,
}: TimelineFormProps) {
  const [formData, setFormData] = useState<TimelineFormData>({
    title: event?.title ?? '',
    description: event?.description ?? '',
    start_time: event?.start_time ?? '',
    end_time: event?.end_time ?? '',
    location: event?.location ?? '',
    vendor_name: event?.vendor_name ?? '',
    vendor_contact: event?.vendor_contact ?? '',
    notes: event?.notes ?? '',
    user_id: event?.user_id ?? '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      action()
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Grid cols={1} sm={2} gap={6}>
        <GridItem sm={2}>
          <FormGroup label="Title" htmlFor="title" required>
            <FormInput
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
            />
          </FormGroup>
        </GridItem>

        <GridItem sm={2}>
          <FormGroup label="Description" htmlFor="description">
            <FormTextarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />
          </FormGroup>
        </GridItem>

        <GridItem>
          <FormGroup label="Start Time" htmlFor="start_time" required>
            <FormInput
              type="datetime-local"
              id="start_time"
              name="start_time"
              required
              value={formData.start_time}
              onChange={handleChange}
            />
          </FormGroup>
        </GridItem>

        <GridItem>
          <FormGroup label="End Time" htmlFor="end_time">
            <FormInput
              type="datetime-local"
              id="end_time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
            />
          </FormGroup>
        </GridItem>

        <GridItem>
          <FormGroup label="Location" htmlFor="location">
            <FormInput
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </FormGroup>
        </GridItem>

        <GridItem>
          <FormGroup label="Vendor Name" htmlFor="vendor_name">
            <FormInput
              type="text"
              id="vendor_name"
              name="vendor_name"
              value={formData.vendor_name}
              onChange={handleChange}
            />
          </FormGroup>
        </GridItem>

        <GridItem>
          <FormGroup label="Vendor Contact" htmlFor="vendor_contact">
            <FormInput
              type="text"
              id="vendor_contact"
              name="vendor_contact"
              value={formData.vendor_contact}
              onChange={handleChange}
            />
          </FormGroup>
        </GridItem>

        <GridItem sm={2}>
          <FormGroup label="Notes" htmlFor="notes">
            <FormTextarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
            />
          </FormGroup>
        </GridItem>

        <GridItem sm={2}>
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              onKeyDown={(e) => handleKeyDown(e, onCancel)}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {event ? 'Update Event' : 'Add Event'}
            </Button>
          </div>
        </GridItem>
      </Grid>
    </Form>
  )
}
