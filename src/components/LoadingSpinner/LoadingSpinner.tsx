'use client'

import { LoadingSpinnerProps } from './types'

export function LoadingSpinner({
  size = 'md',
  color = 'slate',
  className = '',
  label = 'Loading...',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const colorClasses = {
    white: 'border-white',
    slate: 'border-slate-600',
    blue: 'border-blue-600',
  }

  const textColorClasses = {
    white: 'text-white',
    slate: 'text-slate-600',
    blue: 'text-blue-600',
  }

  return (
    <div
      className={`inline-flex items-center ${className}`}
      role="status"
      aria-label={label}>
      <div
        className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
        aria-hidden="true"
      />
      {label && (
        <span
          className={`ml-2 text-sm font-medium ${textColorClasses[color]}`}
          aria-hidden="true">
          {label}
        </span>
      )}
    </div>
  )
}
