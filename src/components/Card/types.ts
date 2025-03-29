import { ReactNode } from 'react'

export type CardVariant = 'default' | 'bordered' | 'elevated' | 'ghost'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'
export type CardTheme = 'white' | 'slate'

export interface CardProps {
  variant?: CardVariant
  padding?: CardPadding
  theme?: CardTheme
  className?: string
  children: ReactNode
}

export interface CardHeaderProps {
  className?: string
  children: ReactNode
}

export interface CardBodyProps {
  className?: string
  children: ReactNode
}

export interface CardFooterProps {
  className?: string
  children: ReactNode
}
