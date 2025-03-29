'use client'

import { ButtonProps } from './types'

export type ButtonVariant =
  | 'primary'
  | 'outline'
  | 'danger'
  | 'success'
  | 'ghost'

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  const widthClasses = fullWidth ? 'w-full' : ''

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-500',
    outline:
      'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-500',
    danger: 'bg-rose-400 text-white hover:bg-rose-500 focus:ring-rose-300',
    success: 'bg-[#B0C3B3] text-white hover:bg-[#9DB3A0] focus:ring-[#C3D1C5]',
    ghost:
      'bg-transparent text-slate-600 hover:bg-slate-50 focus:ring-slate-500',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const iconClasses = {
    sm: 'mr-1.5 h-4 w-4',
    md: 'mr-2 h-5 w-5',
    lg: 'mr-2 h-5 w-5',
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`}
      disabled={disabled || loading}
      {...props}>
      {loading ? (
        <>
          <svg
            className={`animate-spin -ml-1 mr-2 h-4 w-4 ${
              variant === 'primary' ? 'text-white' : 'text-current'
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        <>
          {icon && <span className={iconClasses[size]}>{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}
