import { ReactNode } from 'react'

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void> | void
  className?: string
  children: ReactNode
}

export interface FormGroupProps {
  label: string
  htmlFor: string
  required?: boolean
  error?: string
  className?: string
  children: ReactNode
}

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  className?: string
}

export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  className?: string
}

export interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
  className?: string
  options: Array<{
    value: string
    label: string
  }>
}

export interface FormPriceInputProps extends FormInputProps {
  currency?: string
}
