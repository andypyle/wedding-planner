'use client'

import { cn } from '@/lib/utils'
import { GridItemProps } from './types'

export function GridItem({
  sm,
  md,
  lg,
  xl,
  className,
  children,
  ...props
}: GridItemProps) {
  return (
    <div
      className={cn(
        sm && `sm:col-span-${sm}`,
        md && `md:col-span-${md}`,
        lg && `lg:col-span-${lg}`,
        xl && `xl:col-span-${xl}`,
        className
      )}
      {...props}>
      {children}
    </div>
  )
}
