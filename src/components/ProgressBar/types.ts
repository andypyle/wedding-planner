export type ProgressBarVariant = 'default' | 'success' | 'warning' | 'error'

export interface ProgressBarProps {
  /**
   * The current progress value (0-100)
   */
  value: number
  /**
   * The maximum value (defaults to 100)
   */
  max?: number
  /**
   * The variant of the progress bar
   */
  variant?: ProgressBarVariant
  /**
   * Whether to show the percentage label
   */
  showLabel?: boolean
  /**
   * Custom label text to show instead of percentage
   */
  label?: string
  /**
   * Additional CSS classes
   */
  className?: string
}
