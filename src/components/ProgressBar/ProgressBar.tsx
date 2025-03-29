'use client'

import { ProgressBarProps, ProgressBarVariant } from './types'

const variantStyles: Record<ProgressBarVariant, string> = {
  default: 'text-slate-700',
  success: 'text-slate-700',
  warning: 'text-yellow-600',
  error: 'text-red-600',
}

const variantBarStyles: Record<ProgressBarVariant, string> = {
  default: 'bg-slate-600',
  success: 'bg-slate-600',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
}

export function ProgressBar({
  value,
  max = 100,
  variant = 'default',
  showLabel = true,
  label,
  className = '',
}: ProgressBarProps) {
  console.log('ProgressBar - value:', value)
  console.log('ProgressBar - max:', max)
  console.log('ProgressBar - variant:', variant)
  console.log('ProgressBar - showLabel:', showLabel)
  console.log('ProgressBar - label:', label)
  console.log('ProgressBar - className:', className)

  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const displayLabel = label || `${Math.round(percentage)}%`

  console.log('ProgressBar - percentage:', percentage)
  console.log('ProgressBar - displayLabel:', displayLabel)

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm">
        <span className="font-medium text-slate-700">Progress</span>
        {showLabel && (
          <span className={`font-medium ${variantStyles[variant]}`}>
            {displayLabel}
          </span>
        )}
      </div>
      <div
        className="h-3 w-full overflow-hidden rounded-full bg-slate-200 shadow-inner"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}>
        <div
          className={`h-full rounded-full transition-all duration-300 ${variantBarStyles[variant]} shadow-sm`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
