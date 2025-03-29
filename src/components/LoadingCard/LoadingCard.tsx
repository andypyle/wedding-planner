'use client'

import { LoadingCardProps } from './types'

export function LoadingCard({
  className = '',
  titleWidth = 'md',
  subtitleWidth = 'sm',
  gridCols = 2,
  showSubtitle = true,
  showGrid = true,
  showTitle = true,
}: LoadingCardProps) {
  const titleWidthClasses = {
    sm: 'w-1/4',
    md: 'w-1/3',
    lg: 'w-1/2',
  }

  const subtitleWidthClasses = {
    sm: 'w-1/4',
    md: 'w-1/3',
    lg: 'w-1/2',
  }

  const gridColsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div
      className={`bg-slate-100 p-6 rounded-lg border border-slate-200 animate-pulse ${className}`}
      role="status"
      aria-label="Loading content">
      {showTitle && (
        <div className="h-6 bg-slate-200 rounded mb-4">
          <div
            className={`h-full bg-slate-300 rounded ${titleWidthClasses[titleWidth]}`}
          />
        </div>
      )}

      {showSubtitle && (
        <div className="h-4 bg-slate-200 rounded mb-4">
          <div
            className={`h-full bg-slate-300 rounded ${subtitleWidthClasses[subtitleWidth]}`}
          />
        </div>
      )}

      {showGrid && (
        <div className={`grid gap-4 ${gridColsClasses[gridCols]}`}>
          {Array.from({ length: gridCols }).map((_, index) => (
            <div key={index} className="h-4 bg-slate-200 rounded">
              <div className="h-full bg-slate-300 rounded w-3/4" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
