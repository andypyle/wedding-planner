'use client'

import {
  FormGroup,
  FormInput,
  FormSelect,
  FormTextarea,
} from '@/components/Form/Form'
import { Grid } from '@/components/Grid/Grid'
import { GridItem } from '@/components/Grid/GridItem'
import { ChecklistCategory } from '@/types/checklist'
import { useState } from 'react'
import { ChecklistFormData, ChecklistFormProps } from './types'

const categories: ChecklistCategory[] = [
  'Planning',
  'Venue',
  'Vendors',
  'Attire',
  'Decor',
  'Food & Drink',
  'Entertainment',
  'Transportation',
  'Guest List',
  'Budget',
  'Other',
]

export function ChecklistForm({
  item,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ChecklistFormProps) {
  const [formData, setFormData] = useState<ChecklistFormData>({
    title: item?.title || '',
    description: item?.description || '',
    category: (item?.category as ChecklistCategory) || 'Planning',
    due_date: item?.due_date || '',
    notes: item?.notes || '',
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
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Grid>
        <GridItem>
          <FormGroup label="Title" htmlFor="title" required>
            <FormInput
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </FormGroup>
        </GridItem>

        <GridItem>
          <FormGroup label="Description" htmlFor="description">
            <FormTextarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </FormGroup>
        </GridItem>

        <GridItem>
          <FormGroup label="Category" htmlFor="category" required>
            <FormSelect
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isSubmitting}
              options={categories.map((category) => ({
                value: category,
                label: category,
              }))}
            />
          </FormGroup>
        </GridItem>

        <GridItem>
          <FormGroup label="Due Date" htmlFor="due_date">
            <FormInput
              type="date"
              id="due_date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </FormGroup>
        </GridItem>

        <GridItem>
          <FormGroup label="Notes" htmlFor="notes">
            <FormTextarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </FormGroup>
        </GridItem>
      </Grid>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200">
          {isSubmitting ? 'Saving...' : item ? 'Update Item' : 'Create Item'}
        </button>
      </div>
    </form>
  )
}
