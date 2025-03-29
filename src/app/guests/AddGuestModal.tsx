'use client'

import { createGuest } from '@/app/actions/guests'
import { GuestForm } from '@/components/GuestForm/GuestForm'
import { Guest } from '@/types/guest'
import { useState } from 'react'
import { Modal } from '../../components/Modal'

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
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (
    guestData: Omit<Guest, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    setIsSubmitting(true)
    setError(null)
    try {
      await createGuest(guestData)
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error adding guest:', err)
      setError(err instanceof Error ? err.message : 'Failed to add guest')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Guest">
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}
      <GuestForm
        onSubmit={handleSubmit}
        onCancel={onClose}
        isSubmitting={isSubmitting}
      />
    </Modal>
  )
}
