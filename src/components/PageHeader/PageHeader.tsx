'use client'

import { PageHeaderProps } from './types'

export function PageHeader({
  title,
  description,
  action,
  className = '',
}: PageHeaderProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      action?.onClick()
    }
  }

  return (
    <div
      className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 ${className}`}>
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          onKeyDown={handleKeyDown}
          disabled={action.loading}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={action.label}
          aria-busy={action.loading}>
          {action.icon && (
            <span className="mr-2" aria-hidden="true">
              {action.icon}
            </span>
          )}
          {action.loading ? 'Loading...' : action.label}
        </button>
      )}
    </div>
  )
}
