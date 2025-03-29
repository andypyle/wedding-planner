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
    <div className="modal">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-earth-900 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Modal container */}
      <div
        className={`fixed inset-0 w-full h-full bg-white transform transition-all duration-300 lg:static lg:inset-auto lg:max-w-3xl lg:mx-auto lg:rounded-xl lg:h-auto ${
          isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 lg:px-6">
          <h3 className="text-lg font-medium leading-6 text-slate-900">
            {title}
          </h3>
          <button
            type="button"
            className="rounded-md bg-white text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
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

        {/* Body */}
        <div
          className="overflow-y-auto px-4 py-4 lg:px-6"
          style={{ height: 'calc(100% - 65px)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
