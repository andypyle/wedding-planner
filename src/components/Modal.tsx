'use client'

import { useEffect, useState } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      // Start animation after a brief delay
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      setIsAnimating(false)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className={`fixed inset-0 bg-earth-900 backdrop-blur-sm transition-opacity duration-300 ${
            isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'
          }`}
          onClick={onClose}
        />

        <div
          className={`inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all duration-300 sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle ${
            isAnimating
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0'
          }`}>
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-earth-400 hover:text-earth-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={onClose}>
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-medium leading-6 text-earth-900">
                {title}
              </h3>
              <div className="mt-4">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
