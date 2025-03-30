export interface ImageUploadProps {
  currentImageUrl: string | null
  onUploadComplete: (url: string) => void
  bucket?: string
  folder?: string
  maxSize?: number
  user?: any
}
