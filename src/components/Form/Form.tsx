'use client'

import {
  FormGroupProps,
  FormInputProps,
  FormProps,
  FormSelectProps,
  FormTextareaProps,
} from './types'

export function Form({
  onSubmit,
  className = '',
  children,
  ...props
}: FormProps) {
  return (
    <form onSubmit={onSubmit} className={`space-y-4 ${className}`} {...props}>
      {children}
    </form>
  )
}

export function FormGroup({
  label,
  htmlFor,
  required = false,
  error,
  className = '',
  children,
}: FormGroupProps) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="mt-1">{children}</div>
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function FormInput({ error, className = '', ...props }: FormInputProps) {
  return (
    <input
      className={`block w-full rounded-md border border-slate-300 focus:border-slate-500 focus:ring-slate-500 sm:text-base py-2.5 px-3 ${
        error ? 'border-red-300' : ''
      } ${className}`}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? `${props.id}-error` : undefined}
      {...props}
    />
  )
}

export function FormTextarea({
  error,
  className = '',
  ...props
}: FormTextareaProps) {
  return (
    <textarea
      className={`block w-full rounded-md border border-slate-300 focus:border-slate-500 focus:ring-slate-500 sm:text-base py-2.5 px-3 ${
        error ? 'border-red-300' : ''
      } ${className}`}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? `${props.id}-error` : undefined}
      {...props}
    />
  )
}

export function FormSelect({
  error,
  className = '',
  options,
  ...props
}: FormSelectProps) {
  return (
    <select
      className={`block w-full rounded-md border border-slate-300 focus:border-slate-500 focus:ring-slate-500 sm:text-base py-2.5 px-3 ${
        error ? 'border-red-300' : ''
      } ${className}`}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? `${props.id}-error` : undefined}
      {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export interface FormPriceInputProps extends FormInputProps {
  currency?: string
}

export function FormPriceInput({
  error,
  className = '',
  currency = '$',
  ...props
}: FormPriceInputProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <span className="text-slate-500 sm:text-base">{currency}</span>
      </div>
      <input
        type="number"
        min="0"
        step="0.01"
        className={`block w-full rounded-md border border-slate-300 pl-7 focus:border-slate-500 focus:ring-slate-500 sm:text-base py-2.5 px-3 ${
          error ? 'border-red-300' : ''
        } ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id}-error` : undefined}
        {...props}
      />
    </div>
  )
}
