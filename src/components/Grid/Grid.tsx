'use client'

import { cn } from '@/lib/utils'
import { GridItemProps, GridProps } from './types'

export function Grid({
  cols = 1,
  sm,
  md,
  lg,
  xl,
  gap = 4,
  className,
  children,
  ...props
}: GridProps) {
  return (
    <div
      className={cn(
        'grid',
        `grid-cols-${cols}`,
        sm && `sm:grid-cols-${sm}`,
        md && `md:grid-cols-${md}`,
        lg && `lg:grid-cols-${lg}`,
        xl && `xl:grid-cols-${xl}`,
        `gap-${gap}`,
        className
      )}
      {...props}>
      {children}
    </div>
  )
}

export function GridItem({
  children,
  className = '',
  span = 1,
  sm,
  md,
  lg,
  xl,
  '2xl': twoXl,
}: GridItemProps) {
  const getSpan = () => {
    const base = `col-span-${span}`
    const smSpan = sm ? `sm:col-span-${sm}` : ''
    const mdSpan = md ? `md:col-span-${md}` : ''
    const lgSpan = lg ? `lg:col-span-${lg}` : ''
    const xlSpan = xl ? `xl:col-span-${xl}` : ''
    const twoXlSpan = twoXl ? `2xl:col-span-${twoXl}` : ''

    return `${base} ${smSpan} ${mdSpan} ${lgSpan} ${xlSpan} ${twoXlSpan}`
  }

  return (
    <div className={`${getSpan()} ${className}`} role="gridcell">
      {children}
    </div>
  )
}
