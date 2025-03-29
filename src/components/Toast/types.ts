export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastProps {
  type: ToastType
  message: string
  onClose?: () => void
  duration?: number
  className?: string
}
