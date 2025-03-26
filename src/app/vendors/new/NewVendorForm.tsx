'use client'

import { VendorForm } from '@/components/VendorForm'
import { handleVendorSubmit } from '../actions'

export function NewVendorForm() {
  return (
    <VendorForm
      onSubmit={handleVendorSubmit}
      onCancel={() => (window.location.href = '/vendors')}
    />
  )
}
