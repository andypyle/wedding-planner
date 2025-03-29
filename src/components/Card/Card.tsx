'use client'

import {
  CardBodyProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
} from './types'

export function Card({
  variant = 'default',
  padding = 'md',
  theme = 'white',
  className = '',
  children,
}: CardProps) {
  const variantClasses = {
    default: '',
    bordered: 'border border-slate-200',
    elevated: 'shadow-sm',
    ghost: '',
  }

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const themeClasses = {
    white: 'bg-white',
    slate: 'bg-slate-100',
  }

  return (
    <div
      className={`rounded-lg ${themeClasses[theme]} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      role="article">
      {children}
    </div>
  )
}

export function CardHeader({ className = '', children }: CardHeaderProps) {
  return (
    <div className={`border-b border-slate-200 ${className}`} role="banner">
      {children}
    </div>
  )
}

export function CardBody({ className = '', children }: CardBodyProps) {
  return (
    <div className={`py-4 ${className}`} role="main">
      {children}
    </div>
  )
}

export function CardFooter({ className = '', children }: CardFooterProps) {
  return (
    <div
      className={`border-t border-slate-200 ${className}`}
      role="contentinfo">
      {children}
    </div>
  )
}
