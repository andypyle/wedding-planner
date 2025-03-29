import { ReactNode } from 'react'

export interface PageHeaderProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    icon?: ReactNode
    loading?: boolean
  }
  className?: string
}
