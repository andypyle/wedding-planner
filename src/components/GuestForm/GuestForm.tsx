'use client'

import { Button } from '@/components/Button/Button'
import { Form, FormGroup, FormInput, FormSelect } from '@/components/Form/Form'
import { Grid, GridItem } from '@/components/Grid/Grid'
import { useState } from 'react'
import {
  GUEST_GROUPS,
  GUEST_STATUSES,
  GuestFormData,
  GuestFormProps,
} from './types'

export function GuestForm({
  guest,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: GuestFormProps) {
  const [formData, setFormData] = useState<GuestFormData>({
    first_name: guest?.first_name || '',
    last_name: guest?.last_name || '',
    email: guest?.email || '',
    phone: guest?.phone || '',
    group_name: guest?.group_name || '',
    rsvp_status: guest?.rsvp_status || 'pending',
    plus_one: guest?.plus_one || false,
    dietary_restrictions: guest?.dietary_restrictions || '',
    address: guest?.address || '',
    city: guest?.city || '',
    state: guest?.state || '',
    zip: guest?.zip || '',
    meal_choice: guest?.meal_choice || '',
    plus_one_name: guest?.plus_one_name || '',
    plus_one_meal_choice: guest?.plus_one_meal_choice || '',
    notes: guest?.notes || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
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
        <GridItem>
          <FormGroup label="First Name" htmlFor="first_name" required>
            <FormInput
              type="text"
              id="first_name"
              name="first_name"
              required
              value={formData.first_name}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </FormGroup>
        </GridItem>

        <GridItem>
          <FormGroup label="Last Name" htmlFor="last_name" required>
            <FormInput
              type="text"
              id="last_name"
              name="last_name"
              required
              value={formData.last_name}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </FormGroup>
        </GridItem>

        <GridItem>
          <FormGroup label="Email" htmlFor="email">
            <FormInput
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </FormGroup>
        </GridItem>

        <GridItem>
          <FormGroup label="Phone" htmlFor="phone">
            <FormInput
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </FormGroup>
        </GridItem>

        <GridItem>
          <FormGroup label="Group" htmlFor="group_name" required>
            <FormSelect
              id="group_name"
              name="group_name"
              value={formData.group_name}
              onChange={handleChange}
              disabled={isSubmitting}
              options={GUEST_GROUPS.map((group) => ({
                value: group,
                label: group,
              }))}
            />
          </FormGroup>
        </GridItem>

        <GridItem>
          <FormGroup label="RSVP Status" htmlFor="rsvp_status">
            <FormSelect
              id="rsvp_status"
              name="rsvp_status"
              value={formData.rsvp_status}
              onChange={handleChange}
              disabled={isSubmitting}
              options={GUEST_STATUSES.map((status) => ({
                value: status,
                label: status,
              }))}
            />
          </FormGroup>
        </GridItem>

        <GridItem sm={2}>
          <div className="relative flex items-start">
            <div className="flex h-5 items-center">
              <input
                type="checkbox"
                id="plus_one"
                name="plus_one"
                checked={formData.plus_one}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                disabled={isSubmitting}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="plus_one" className="font-medium text-slate-700">
                Plus One
              </label>
              <p className="text-slate-500">This guest has a plus one</p>
            </div>
          </div>
        </GridItem>

        <GridItem sm={2}>
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              onKeyDown={(e) => handleKeyDown(e, onCancel)}
              disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {guest ? 'Update Guest' : 'Add Guest'}
            </Button>
          </div>
        </GridItem>
      </Grid>
    </Form>
  )
}
