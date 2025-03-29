'use client'

import { createGuest } from '@/app/actions/guests'
import { GuestForm } from '@/components/GuestForm'
import { Modal } from '@/components/Modal'
import { Guest } from '@/types/guest'
import { useState } from 'react'

interface AddGuestModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddGuestModal({
  isOpen,
  onClose,
  onSuccess,
}: AddGuestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (
    guestData: Omit<Guest, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    setIsSubmitting(true)
    try {
      await createGuest(guestData)
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error adding guest:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Guest">
      <GuestForm
        onSubmit={handleSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
      />
    </Modal>
  )
}
